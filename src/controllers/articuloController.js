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
            const limit = 10;
            const page = parseInt(req.query.page) || 1;
            const offset = (page - 1) * limit;
            const tipo = req.query.tipo || '';

            const { user } = req;

            const rol = user.rol.nombre;

            const { rows, count } = await articuloRepository.findAndCountAll({ seleccion: tipo, limit, offset, rol });
            
            if (!rows || count === 0) {
                return sendError(res, 404, "No se encontraron artículos.");
            }
            const totalPages = Math.ceil(count / limit);

            return sendSuccess(res, 200, "Artículos recuperados exitosamente.", {
                data: rows,
                meta: {
                    totalItems: count,
                    currentPage: page,
                    totalPages,
                    pageSize: limit
                }
            });
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
            return sendSuccess(res, 200, "Artículo actualizado exitosamente.", updatedArticulo);
        } catch (error) {
            return sendError(res, 500, `Error al actualizar artículo: ${error.message}`);
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

    static async obtenerServiciosPorMuseo(req, res) {
        try {
            const museoId = Number(req.params.museoId);

            const servicios = await articuloRepository.obtenerServiciosPorMuseo(museoId);

            return sendSuccess(res, 200, "Servicios obtenidos correctamente.", servicios);

        } catch (error) {
            return sendError(res, 500, `Error al obtener servicios: ${error.message}`);
        }
    }

    static async toggleEnableArticulo(req, res) {
        try {
            const { id } = req.params;

            const articulo = await articuloRepository.updateHabilitado({id});

            if (!articulo) {
                return sendError(res, 404, "Artículo no encontrado.");
            }
            return sendSuccess(res, 200, `Artículo actualizado exitosamente.`, articulo);
        } catch (error) {
            return sendError(res, 500, `Error al cambiar estado del artículo: ${error.message}`);
        }   
    }
}