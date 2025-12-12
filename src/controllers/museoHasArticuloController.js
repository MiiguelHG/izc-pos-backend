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
          const { id } = req.params;
      
          const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
          const pageSize = Math.max(parseInt(req.query.pageSize, 10) || 10, 1);
          const offset = (page - 1) * pageSize;
    
          const articulos = await museoHasArticuloRepository.getArticulosByMuseo(id, { limit: pageSize, offset });
    
          const total = await museoHasArticuloRepository.countRelaciones(id)
          const totalPages = Math.max(Math.ceil(total / pageSize), 1);
    
          return sendSuccess(res, 200, 'Artículos obtenidos exitosamente', {
            data: articulos,
            meta: {
              totalItems: total,
              currentPage: page,
              totalPages,
              pageSize
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

        static async removeArticuloFromMuseo(req, res) {
          try {
            const museoId = req.params.museoId;
            const articuloId = req.params.articuloId;
            const deleted = await museoHasArticuloRepository.removeArticulo(museoId, articuloId);
            if (!deleted) return sendError(res, 404, 'Relación no encontrada');
            return sendSuccess(res, 200, 'Relación eliminada exitosamente', { deleted });
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
   
}