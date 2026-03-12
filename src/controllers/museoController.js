import { sendError, sendSuccess } from '../utils/responseFormater.js';
import { museoRepository } from '../repositories/index.js';

export class MuseoController {
  static async createMuseo(req, res) {
    try {
      const { nombre, ubicacion } = req.body;

      const newMuseo = await museoRepository.createMuseo({ nombre, ubicacion});

      if (!newMuseo) {
        return sendError(res, 400, 'No se pudo crear el museo');
      }

      return sendSuccess(res, 201, 'Museo creado exitosamente', newMuseo);
    } catch (error) {
      return sendError(res, 500, `Error interno del servidor: ${error.message}`);
    }
  }

  static async getAndCountAllMuseos(req, res) {
    try {
      const limit = 10;
      const page = parseInt(req.query.page) || 1;
      const offset = (page - 1) * limit;

      const { rows, count } = await museoRepository.findAndCountAll({ limit, offset });

      if (!rows || rows.length === 0) {
        return sendError(res, 404, 'No se encontraron museos');
      }

      const totalPages = Math.ceil(count / limit);

      return sendSuccess(res, 200, 'Museos obtenidos exitosamente', {
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

  static async getAllMuseos(req, res) {
    try {
      const museos = await museoRepository.findAll();
      if (!museos || museos.length === 0) {
        return sendError(res, 404, 'No se encontraron museos');
      }
      return sendSuccess(res, 200, 'Museos obtenidos exitosamente', museos);
    } catch (error) {
      return sendError(res, 500, `Error interno del servidor: ${error.message}`);
    }
  }

  static async getMuseoById(req, res) {
    try {
      const { id } = req.params;

      const museo = await museoRepository.findById(id);

      if (!museo) {
        return sendError(res, 404, 'Museo no encontrado');
      }

      return sendSuccess(res, 200, 'Museo obtenido exitosamente', museo);
    } catch (error) {
      return sendError(res, 500, `Error interno del servidor: ${error.message}`);
    }
  }

  static async updateMuseo(req, res) {
    try {
      const { id } = req.params;
      const { nombre, ubicacion } = req.body;

      const updated = await museoRepository.updateMuseo(id, { nombre, ubicacion });

      if (!updated) {
        return sendError(res, 400, 'No se pudo actualizar el museo');
      }

      // Tal vez se pueda devolver el museo actualizado aquí, pero no es obligatorio

      return sendSuccess(res, 200, 'Museo actualizado exitosamente', updated);
    } catch (error) {
      return sendError(res, 500, `Error interno del servidor: ${error.message}`);
    }
  }
}