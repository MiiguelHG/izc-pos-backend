import { productoVentaRepository } from "#repositories/index.js";
import { sendError, sendSuccess } from "#utils/responseFormater.js";

export class ProductoVentaController {
    static async createVentaProductosCompleta(req, res) {
        try {
            const { total, carritoProductos, museoId, usuarioId, formaPagoId } = req.body;
            const nuevaVenta = await productoVentaRepository.createVentaProductosCompleta({ total, carritoProductos, museoId, usuarioId, formaPagoId });
            
            if(!nuevaVenta){
                return sendError(res, 400, "No se pudo crear la venta de productos.");
            }
            
            return sendSuccess(res, 201, "Venta de productos creada correctamente.", nuevaVenta);
        }catch(error){
            return sendError(res, 500, "Error al crear la venta de productos.", error.message);
        }
    }

    static async getProductoVentaById(req, res){
        try {
            const { id } = req.params;
            const venta = await productoVentaRepository.findByIdWithChildren({ id });
            if(!venta){
                return sendError(res, 404, "Venta de productos no encontrada.");
            }
            return sendSuccess(res, 200, "Venta de productos obtenida correctamente.", venta);
        }catch(error){
            return sendError(res, 500, "Error al obtener la venta de productos por ID.", error.message);
        }
    }

    static async getAllProductoVentas(req, res){
        try{
            const limit = 10;
            const page = parseInt(req.query.offset) || 1;
            const offset = (page - 1) * limit;

            const {rows, count} = await productoVentaRepository.findAllAndCount({ limit, offset });

            if(count === 0){
                return sendError(res, 404, "No se encontraron ventas de productos.");
            }

            const totalPages = Math.ceil(count / limit);
            return sendSuccess(res, 200, "Ventas de productos obtenidas correctamente.", {
                ventas: rows,
                pagination: {
                    totalItems: count,
                    currentPage: page,
                    totalPages: totalPages,
                    pageSize: limit
                }
            });
        }catch(error){
            return sendError(res, 500, "Error al obtener las ventas de productos.", error.message);
        }
    }

    static async getAllProductoVentasByMuseoId(req, res){
        try{
            const { museoId } = req.params;
            const limit = 10;
            const page = parseInt(req.query.offset) || 1;
            const offset = (page - 1) * limit;
            const search = req.query.search;

            const {rows, count} = await productoVentaRepository.findAllAndCountByMuseoId({ museoId, limit, offset, search });

            if(count === 0){
                return sendError(res, 404, "No se encontraron ventas de productos para este museo.");
            }
            const totalPages = Math.ceil(count / limit);
            return sendSuccess(res, 200, "Ventas de productos obtenidas correctamente.", {
                ventas: rows,
                pagination: {
                    totalItems: count,
                    currentPage: page,
                    totalPages: totalPages,
                    pageSize: limit
                }
            });
        }catch(error){
            return sendError(res, 500, "Error al obtener las ventas de productos por museoId.", error.message);
        }
    }
}