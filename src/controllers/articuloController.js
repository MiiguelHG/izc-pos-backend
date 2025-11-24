import { articuloRepository } from "../repositories/index.js";
import { sendError, sendSuccess } from "../utils/responseFormater.js";

export class ArticuloController {
    static async createArticulo(req, res) {
        try {
            const { nombre, descripcion, precioEstandar, tipo } = req.body;
            const newArticulo = await articuloRepository.create({ nombre, descripcion, precioEstandar, tipo });
            if(!newArticulo) {
                return sendError(res, 400, "No se pudo crear el artículo.");
            }
            return sendSuccess(res, 201, "Artículo creado exitosamente.", newArticulo);
        } catch (error) {
            return sendError(res, 500, `Error al crear artículo: ${error.message}`);
        }
    }

    static async getArticulo(req, res) {
        try {
            const articulos = await articuloRepository.findAll();
            if(!articulos) {
                return sendError(res, 404, "No se encontraron artículos.");
            }
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
            const { id } = req.params;
            const { nombre, descripcion, precioEstandar, tipo } = req.body;

            const updatedArticulo = await articuloRepository.update({id}, {nombre, descripcion, precioEstandar, tipo});
            
            if (!updatedArticulo) {
                return sendError(res, 404, "Artículo no encontrado.");
            }
            return sendSuccess(res, 200, "Artículo actualizado exitosamente.", nombre, descripcion, precioEstandar, tipo);
        } catch (error) {
            return sendError(res, 500, `Error al actualizar artículo: ${error.message}`);
        }
    }

    static async deleteArticulo(req, res) {
        try {
            const deleted = await articuloRepository.delete({id: req.params.id});
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