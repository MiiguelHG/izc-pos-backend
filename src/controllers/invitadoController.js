import { invitadoRepository, boletoEmitidoRepository } from "#repositories/index.js";
import { sendError, sendSuccess } from "#utils/responseFormater.js";

export class InvitadoController {
  static async createInvitado(req, res) {
    try {
      const { nombre, motivo, usuarioId, museoId } = req.body;

      const { user } = req;

      if (user.rol?.nombre !== 'admin' && user.museo.id !== museoId) {
        return sendError(res, 403, "No tienes permiso para crear un invitado para este museo");
      }

      const nuevoInvitado = await invitadoRepository.create({
        nombre,
        motivo,
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

      const user = req.user;

      const museoId = user.rol?.nombre === 'admin' ? null : user.museo.id;

      const { rows, count} = await invitadoRepository.findAllAndCount({ limit, offset, museoId });
      if (count === 0) {
        return sendError(res, 404, "No se encontraron cortesias");
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
      const { id } = req.params;
      const user = req.user;

      const invitado = await invitadoRepository.findById(id);
      if (!invitado) {
        return sendError(res, 404, "Invitación no encontrada");
      }

      if (invitado.usado === 'usado') {
        return sendError(res, 400, "La invitación ya ha sido usada");
      }

      if (invitado.usado === 'cancelado') {
        return sendError(res, 400, "La invitación ha sido cancelada");
      }

      if (invitado.museoId !== user.museo.id) {
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

      if (invitado.usado === 'usado') {
        return sendError(res, 400, "La invitación ya ha sido usada");
      }

      if (invitado.usado === 'cancelado') {
        return sendError(res, 400, "La invitación ha sido cancelada");
      }

      if (invitado.museoId !== boletoEmitido.museoId) {
        return sendError(res, 400, "El invitado no corresponde al museo del boleto emitido");
      }
      //--------------------------------

      const actualizado = await invitadoRepository.update(
        { id },
        { usado: 'usado', boletoEmitidoId }
      );

      return sendSuccess(res, 200, "Invitado marcado como usado exitosamente", actualizado);
    } catch (error) {
      return sendError(res, 500, `Error al marcar invitado como usado: ${error.message}`);
    }
  }

  static async updateInvitado(req, res) {
    try {
      const { id } = req.params;
      const { nombre, motivo, usuarioId, museoId } = req.body;

      const actualizado = await invitadoRepository.update(
        { id },
        { nombre, motivo, usuarioId, museoId }
      );

      if (!actualizado) {
        return sendError(res, 404, "Invitación no encontrada o no se pudo actualizar");
      }

      return sendSuccess(res, 200, "Invitado actualizado exitosamente", actualizado);
    } catch (error) {
      return sendError(res, 500, `Error al actualizar invitado: ${error.message}`);
    }

  }

  static async cancelarInvitado(req, res) {
    try {
      const { id } = req.params;
      const actualizado = await invitadoRepository.update(
        { id },
        { usado: 'cancelado' }
      );
      
      if (!actualizado) {
        return sendError(res, 404, "Invitación no encontrada o no se pudo cancelar");
      }

      return sendSuccess(res, 200, "Invitado cancelado exitosamente", actualizado);
    } catch (error) {
      return sendError(res, 500, `Error al cancelar invitado: ${error.message}`);
    }   
  }
}