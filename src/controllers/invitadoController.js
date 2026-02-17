import { invitadoRepository, boletoEmitidoRepository } from "#repositories/index.js";
import { sendError, sendSuccess } from "#utils/responseFormater.js";

export class InvitadoController {
  static async createInvitado(req, res) {
    try {
      const { nombre, motivo, usuarioId, museoId } = req.body;

      const fechaExpiracion = new Date();
      fechaExpiracion.setDate(fechaExpiracion.getDate() + 1); // Expira en 1 días

      const nuevoInvitado = await invitadoRepository.create({
        nombre,
        motivo,
        fechaExpiracion,
        usuarioId,
        museoId
      });

      if (!nuevoInvitado) {
        return sendError(res, 500, "No se pudo crear el invitado");
      }

      return sendSuccess(res, 201, "Invitado creado exitosamente", nuevoInvitado);
    } catch (error) {
      return sendError(res, 500, `Error al crear el invitado: ${error.message}`);  
    }
  }

  static async getInvitados(req, res) {
    try {
      const limit = 10;
      const page = parseInt(req.query.page) || 1;
      const offset = (page - 1) * limit;

      const { rows, count} = await invitadoRepository.findAllAndCount({ limit, offset });
      if (!rows || rows.length === 0) {
        return sendError(res, 200, "No se encontraron invitados");
      }

      const totalPages = Math.ceil(count / limit);

      return sendSuccess(res, 200, "Invitados recuperados exitosamente", {  
        data: rows,
        meta: {
          totalItems: count,
          currentPage: page,
          totalPages,
          pageSize: limit
        }
      });
    } catch (error) {
      return sendError(res, 500, `Error al obtener invitados: ${error.message}`);
    }
  }

  static async getInvitacionVigente(req, res) {
    try {
      const { id, museoId } = req.params;
      const invitado = await invitadoRepository.findById(id);
      if (!invitado) {
        return sendError(res, 404, "Invitación no encontrada");
      }

      if (invitado.usado) {
        return sendError(res, 400, "La invitación ya ha sido usada");
      }

      if (invitado.museoId !== Number(museoId)) {
        return sendError(res, 400, "La invitación no corresponde a este museo");
      }
      
      return sendSuccess(res, 200, "Invitación vigente recuperada exitosamente", invitado);
    } catch (error) {
      return sendError(res, 500, `Error al obtener la invitación vigente: ${error.message}`);
    }
  }

  static async marcarInvitadoUsado(req, res) {
    try {
      const { id, boletoEmitidoId } = req.params;

      // Esto puede ir en un middleware para validar que el invitado existe y no ha expirado antes de llegar a este punto
      const invitado = await invitadoRepository.findById(id);
      const boletoEmitido = await boletoEmitidoRepository.findById(boletoEmitidoId);

      if (!invitado) {
        return sendError(res, 404, "Invitado no encontrado");
      }

      if (invitado.usado) {
        return sendError(res, 400, "El invitado ya ha sido usado");
      }

      if (invitado.museoId !== boletoEmitido.museoId) {
        return sendError(res, 400, "El invitado no corresponde al museo del boleto emitido");
      }
      //--------------------------------

      const actualizado = await invitadoRepository.update(
        { id },
        { usado: true, boletoEmitidoId }
      );

      return sendSuccess(res, 200, "Invitado marcado como usado exitosamente", actualizado);
    } catch (error) {
      return sendError(res, 500, `Error al marcar invitado como usado: ${error.message}`);
    }
  }
}