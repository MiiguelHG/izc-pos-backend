import { museoHasArticuloRepository } from "#repositories/index.js";
import { sendError, sendSuccess } from "#utils/responseFormater.js";

export class MuseoHasArticuloController {
  static async addArticuloToMuseo(req, res) {
    try {
        const { museoId, articuloId } = req.body;
        const newAssociation = await museoHasArticuloRepository.create({ museoId, articuloId });
        if (!newAssociation) {
            return sendError(res, 400, "No se pudo agregar el artículo al museo.");
        }
        return sendSuccess(res, 201, "Artículo agregado al museo exitosamente", newAssociation);
    } catch (error) {
        return sendError(res, 500, `Error interno del servidor: ${error.message}`);
    }
  }

  static async getArticulosByMuseoId(req, res) {
    try {
      const { id, tipo } = req.params;
      const limit = 10;
  
      const page = parseInt(req.query.page) || 1;
      const offset = (page - 1) * limit;
      const { user } = req;

      const isOperador = user.rol.nombre === 'operador';

      const { rows, count } = await museoHasArticuloRepository.getArticulosByMuseo({ museoId: id, tipo: tipo, limit, offset, isOperador });

      const totalPages = Math.ceil(count / limit);

      return sendSuccess(res, 200, 'Artículos obtenidos exitosamente', {
        data: rows,
        meta: {
          totalItems: count,
          currentPage: page,
          totalPages,
          pageSize: limit
        }
      });
    } catch (error) {
      return sendError(res, 500, `Error interno del servidor: ${error.message}`);
    }
  }

  static async getAllAssociations(req, res) {
    try {
      const rows = await museoHasArticuloRepository.findAll();
      return sendSuccess(res, 200, 'Asociaciones obtenidas exitosamente', rows);
    } catch (error) {
      return sendError(res, 500, `Error interno del servidor: ${error.message}`);
    }
  }

  static async getByMuseo(req, res) {
    try {
      const { id } = req.params;
      const rows = await museoHasArticuloRepository.findAll({ where: { museoId: id } });
      return sendSuccess(res, 200, 'Asociaciones por museo obtenidas exitosamente', rows);
    } catch (error) {
      return sendError(res, 500, `Error interno del servidor: ${error.message}`);
    }
  }

  static async getByArticulo(req, res) {
    try {
      const { id } = req.params;
      const rows = await museoHasArticuloRepository.findAll({ where: { articuloId: id } });
      return sendSuccess(res, 200, 'Asociaciones por artículo obtenidas exitosamente', rows);
    } catch (error) {
      return sendError(res, 500, `Error interno del servidor: ${error.message}`);
    }
  }

  static async setArticulosForMuseo(req, res) {
    try {
      const { id } = req.params; // museo id
      const articuloIds = req.body.articuloIds ?? req.body.articulosIds;
      if (!Array.isArray(articuloIds)) return sendError(res, 400, 'Se requiere `articuloIds` como array en el body');
      const result = await museoHasArticuloRepository.setArticulos(id, articuloIds);
      return sendSuccess(res, 200, 'Relaciones actualizadas exitosamente', { result });
    } catch (error) {
      return sendError(res, 500, `Error interno del servidor: ${error.message}`);
    }
  }

  static async toggleEnableArticulosForMuseo(req, res) {
    try {
      const { articuloId } = req.params;
      const { user } = req;

      const museoId = user.museoId;

      const association = await museoHasArticuloRepository.getbyId(museoId, articuloId);

      if (!association) {
        return sendError(res, 404, 'No se encontró la relación entre el artículo y el museo');
      }

      const updated = await museoHasArticuloRepository.update(
        { articuloId, museoId },
        { habilitado: !association.habilitado }
      );

      if (!updated) {
        return sendError(res, 400, 'No se pudo actualizar el estado del artículo para el museo');
      }
      return sendSuccess(res, 200, 'Artículo actualizado exitosamente', updated);
    } catch (error) {
      return sendError(res, 500, `Error interno del servidor: ${error.message}`);
    }
  }
   
}