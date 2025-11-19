import { articuloRepository } from "../repositories/index.js";
import { sendError, sendSuccess } from "../utils/responseHandler.js";

export class ArticuloController {
    static async createArticulo(req, res) {
        try {
            const { nombre, precio, descripcion, tipo } = req.body;
            const newArticulo = await articuloRepository.createArticulo({ nombre, precio, descripcion, tipo });
            return sendSuccess(res, 201, "Artículo creado exitosamente.", newArticulo);
        } catch (error) {
            return sendError(res, 500, `Error al crear artículo: ${error.message}`);
        }
    }

    static async getArticulo(req, res) {
        try {
            const articulos = await articuloRepository.getArticulo();
            return sendSuccess(res, 200, "Artículos recuperados exitosamente.", articulos);
        } catch (error) {
            return sendError(res, 500, `Error al obtener artículos: ${error.message}`);
        }
    }

    static async getArticuloById(req, res) {
        try {
            const articulo = await articuloRepository.getArticuloById(req.params.id);
            if (!articulo) {
                return sendError(res, 404, "Artículo no encontrado.");
            }
            return sendSuccess(res, 200, "Artículo recuperado exitosamente.", articulo);
        } catch (error) {
            return sendError(res, 500, `Error al obtener artículo por ID: ${error.message}`);
        }
    }

    static async updateArticulo(req, res) {
        try {
            const updateData = req.body;
            const updatedArticulo = await articuloRepository.updateArticulo(req.params.id, updateData);
            if (!updatedArticulo) {
                return sendError(res, 404, "Artículo no encontrado.");
            }
            return sendSuccess(res, 200, "Artículo actualizado exitosamente.", updatedArticulo);
        } catch (error) {
            return sendError(res, 500, `Error al actualizar artículo: ${error.message}`);
        }
    }

    static async deleteArticulo(req, res) {
        try {
            const deleted = await articuloRepository.deleteArticulo(req.params.id);
            if (!deleted) {
                return sendError(res, 404, "Artículo no encontrado.");
            }
            return sendSuccess(res, 200, "Artículo eliminado exitosamente.");
        } catch (error) {
            return sendError(res, 500, `Error al eliminar artículo: ${error.message}`);
        }
    }

    static async obtenerPorTipo(req, res) {
        try {
            const { tipo } = req.params;
            const articulos = await articuloRepository.obtenerPorTipo(tipo);
            return sendSuccess(res, 200, "Artículos recuperados exitosamente.", articulos);
        } catch (error) {
            return sendError(res, 500, `Error al obtener artículos por tipo: ${error.message}`);
        }
    }
}