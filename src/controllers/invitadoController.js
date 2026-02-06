import { invitadoRepository } from "#repositories/index.js";
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
      const invitados = await invitadoRepository.findAll();
      if (!invitados) {
        return sendError(res, 404, "No se encontraron invitados");
      }
      return sendSuccess(res, 200, "Invitados recuperados exitosamente", invitados);
    } catch (error) {
      return sendError(res, 500, `Error al obtener invitados: ${error.message}`);
    }
  }

  static async getInvitadosSinIngreso(req, res) {
    try {
      const invitados = await invitadoRepository.findInvitadosSinIngreso();

      if (!invitados) {
        return sendError(res, 404, "No se encontraron invitados sin ingreso");
      }

      return sendSuccess(res, 200, "Invitados sin ingreso recuperados exitosamente", invitados);
    } catch (error) {
      return sendError(res, 500, `Error al obtener invitados sin ingreso: ${error.message}`);
    }
    
  }

  static async getInvitadoById(req, res) {
    try {
      const { id } = req.params;
      const invitado = await invitadoRepository.findById(id);
      if (!invitado) {
        return sendError(res, 404, "Invitado no encontrado");
      }
      return sendSuccess(res, 200, "Invitado recuperado exitosamente", invitado);
    } catch (error) {
      return sendError(res, 500, `Error al obtener el invitado: ${error.message}`);
    }
  }

  static async marcarInvitadoUsado(req, res) {
    try {
      const { id } = req.params;
      const { boletoEmitidoId } = req.body;

      // Esto puede ir en un middleware para validar que el invitado existe y no ha expirado antes de llegar a este punto
      const invitado = await invitadoRepository.findById(id);

      if (!invitado) {
        return sendError(res, 404, "Invitado no encontrado");
      }

      if (invitado.usado) {
        return sendError(res, 400, "El invitado ya ha sido usado");
      }
      // ---------------------

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