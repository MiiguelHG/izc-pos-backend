import { sendError, sendSuccess } from '../utils/responseFormater.js';
import { museoRepository } from '../repositories/index.js';
import db from '../models/index.js';

export class MuseoController {
  static async createMuseo(req, res) {
    try {
      const { nombre, ubicacion } = req.body;

      const newMuseo = await museoRepository.create({ nombre, ubicacion });

      if (!newMuseo) {
        return sendError(res, 400, 'No se pudo crear el museo');
      }

      return sendSuccess(res, 201, 'Museo creado exitosamente', newMuseo);
    } catch (error) {
      return sendError(res, 500, `Error interno del servidor: ${error.message}`);
    }
  }

  static async getAllMuseos(req, res) {
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

      const updated = await museoRepository.update({ id }, { nombre, ubicacion });

      if (!updated) {
        return sendError(res, 400, 'No se pudo actualizar el museo');
      }

      // Tal vez se pueda devolver el museo actualizado aquí, pero no es obligatorio

      return sendSuccess(res, 200, 'Museo actualizado exitosamente', updated);
    } catch (error) {
      return sendError(res, 500, `Error interno del servidor: ${error.message}`);
    }
  }

  static async deleteMuseo(req, res) {
    try {
      const { id } = req.params;

      const deleted = await museoRepository.delete({ id });
      
      if (!deleted) {
        return sendError(res, 400, 'No se pudo eliminar el museo');
      }

      return sendSuccess(res, 200, 'Museo eliminado exitosamente', deleted);
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

      const articulos = await museoRepository.getArticulosByMuseo(id, { limit: pageSize, offset });

      const total = await museoRepository.countRelaciones(id)
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

  static async getMuseosByArticulos(req, res){
    try{
      const { articuloId } = req.params;
      const museos = await museoRepository.getMuseosByArticulos(articuloId);
      return sendSuccess(res, 200, 'Museos obtenidos exitosamente', museos);
    } catch (error) {
      return sendError(res, 500, `Error interno del servidor: ${error.message}`);
    }
  }

  static async addArticulo(req, res){
    try{
      const { id } = req.params;
      const articuloId = req.params.articuloId || req.body.articuloId;
      const result = await museoRepository.addArticulo(id, articuloId);
      if (!result || result.success === false) {
        return sendError(res, 400, result?.error || 'No se pudo agregar el artículo');
      }
      return sendSuccess(res, 200, 'Artículo agregado exitosamente', result.data);
    } catch (error) {
      return sendError(res, 500, `Error interno del servidor: ${error.message}`);
    }
  }

  static async removeArticulo(req, res){
    try{
      const { id } = req.params;
      const articuloId = req.params.articuloId || req.body.articuloId;
      const result = await museoRepository.removeArticulo(id, articuloId);
      if (!result || result.success === false) {
        return sendError(res, 400, result?.error || 'No se pudo remover el artículo');
      }
      return sendSuccess(res, 200, 'Artículo removido exitosamente', result.data);
    } catch (error) {
      return sendError(res, 500, `Error interno del servidor: ${error.message}`);
    }
  }

  static async setArticulos(req, res){
    try{
      const { id } = req.params;
      // Aceptar ambas variantes por compatibilidad con peticiones existentes
      const articuloIds = req.body.articuloIds ?? req.body.articulosIds;

      if (!Array.isArray(articuloIds)) {
        return sendError(res, 400, 'Se requiere `articuloIds` como array en el body');
      }

      const result = await museoRepository.setArticulos(id, articuloIds);
      // Si el repositorio aún usa throw en lugar de patrón {success,..}, result puede ser true
      if (result && (result.success === false)) {
        return sendError(res, 400, result.error || 'No se pudieron establecer artículos');
      }
      return sendSuccess(res, 200, 'Artículos establecidos exitosamente', result?.data ?? true);
    } catch (error) {
      return sendError(res, 500, `Error interno del servidor: ${error.message}`);
    }
  }

  static async hasArticulo(req, res){
    try{
      const { id } = req.params;
      const { articuloId } = req.body;
      const hasRel = await museoRepository.hasArticulo(id, articuloId);
      return sendSuccess(res, 200, 'Verificación realizada exitosamente', { hasArticulo: hasRel });
    } catch (error) {
      return sendError(res, 500, `Error interno del servidor: ${error.message}`);
    }
  }
}