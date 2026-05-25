import { invitadoRepository, boletoEmitidoRepository } from "#repositories/index.js";
import { sendError, sendSuccess } from "#utils/responseFormater.js";

export class InvitadoController {
  static async createInvitado(req, res) {
    try {
      const { nombre, motivo, usuarioId, museoId } = req.body;

      const { user } = req;

      if (user.rol?.nombre !== 'admin' && user.museo.id !== museoId) {
        return sendError(res, 403, "No tienes permiso para crear una cortesía para este museo");
      }

      const nuevoInvitado = await invitadoRepository.create({
        nombre,
        motivo,
        usuarioId,
        museoId
      });

      if (!nuevoInvitado) {
        return sendError(res, 500, "No se pudo crear la cortesía");
      }

      return sendSuccess(res, 201, "Cortesía creada exitosamente", nuevoInvitado);
    } catch (error) {
      return sendError(res, 500, `Error al crear la cortesía: ${error.message}`);  
    }
  }

  static async getInvitados(req, res) {
    try {
      const limit = 10;
      const page = parseInt(req.query.page) || 1;
      const offset = (page - 1) * limit;
      const search = req.query.search;

      const user = req.user;

      const museoId = user.rol?.nombre === 'admin' ? null : user.museo.id;

      const { rows, count} = await invitadoRepository.findAllAndCount({ limit, offset, museoId , search});
      if (count === 0) {
        return sendError(res, 404, "No se encontraron cortesías");
      }

      const totalPages = Math.ceil(count / limit);

      return sendSuccess(res, 200, "Cortesías recuperadas exitosamente", {  
        data: rows,
        meta: {
          totalItems: count,
          currentPage: page,
          totalPages,
          pageSize: limit
        }
      });
    } catch (error) {
      return sendError(res, 500, `Error al obtener cortesías: ${error.message}`);
    }
  }

  static async getInvitacionVigente(req, res) {
    try {
      const { id } = req.params;
      const user = req.user;

      const invitado = await invitadoRepository.findById(id);
      if (!invitado) {
        return sendError(res, 404, "Cortesía no encontrada");
      }

      if (invitado.usado === 'usado') {
        return sendError(res, 400, "La cortesía ya ha sido usada");
      }

      if (invitado.usado === 'cancelado') {
        return sendError(res, 400, "La cortesía ha sido cancelada");
      }

      if (invitado.museoId !== user.museo.id) {
        return sendError(res, 400, "La cortesía no corresponde a este museo");
      }
      
      return sendSuccess(res, 200, "Cortesía vigente recuperada exitosamente", invitado);
    } catch (error) {
      return sendError(res, 500, `Error al obtener la cortesía vigente: ${error.message}`);
    }
  }

  static async marcarInvitadoUsado(req, res) {
    try {
      const { id, boletoEmitidoId } = req.params;

      // Esto puede ir en un middleware para validar que el invitado existe y no ha expirado antes de llegar a este punto
      const invitado = await invitadoRepository.findById(id);
      const boletoEmitido = await boletoEmitidoRepository.findById(boletoEmitidoId);

      if (!invitado) {
        return sendError(res, 404, "Cortesía no encontrada");
      }

      if (invitado.usado === 'usado') {
        return sendError(res, 400, "La cortesía ya ha sido usada");
      }

      if (invitado.usado === 'cancelado') {
        return sendError(res, 400, "La cortesía ha sido cancelada");
      }

      if (invitado.museoId !== boletoEmitido.museoId) {
        return sendError(res, 400, "La cortesía no corresponde al museo del boleto emitido");
      }
      //--------------------------------

      const actualizado = await invitadoRepository.update(
        { id },
        { usado: 'usado', boletoEmitidoId }
      );

      return sendSuccess(res, 200, "Cortesía marcada como usada exitosamente", actualizado);
    } catch (error) {
      return sendError(res, 500, `Error al marcar cortesía como usada: ${error.message}`);
    }
  }

  static async updateInvitado(req, res) {
    try {
      const { id } = req.params;
      const { nombre, motivo, usuarioId, museoId } = req.body;

      const invitacion = await invitadoRepository.findById(id);

      if (!invitacion) {
        return sendError(res, 404, "Cortesía no encontrada");
      }

      if (invitacion.usado === 'cancelado') {
        return sendError(res, 400, "No se puede actualizar una cortesía cancelada");
      }

      if (invitacion.usado === 'usado') {
        return sendError(res, 400, "No se puede actualizar una cortesía usada");
      }

      const actualizado = await invitadoRepository.update(
        { id },
        { nombre, motivo, usuarioId, museoId }
      );

      if (!actualizado) {
        return sendError(res, 404, "Cortesía no encontrada o no se pudo actualizar");
      }

      return sendSuccess(res, 200, "Cortesía actualizada exitosamente", actualizado);
    } catch (error) {
      return sendError(res, 500, `Error al actualizar cortesía: ${error.message}`);
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
        return sendError(res, 404, "Cortesía no encontrada o no se pudo cancelar");
      }

      return sendSuccess(res, 200, "Cortesía cancelada exitosamente", actualizado);
    } catch (error) {
      return sendError(res, 500, `Error al cancelar cortesía: ${error.message}`);
    }   
  }
}