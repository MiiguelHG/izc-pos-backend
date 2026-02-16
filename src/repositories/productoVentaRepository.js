import BaseRepository from "./baseRepository.js";
import { productoDetalleRepository, articuloRepository } from "./index.js";
import db from "../models/index.js";

const { productoVenta, sequelize, productoDetalle, usuario, articulo, formaPago } = db;

class ProductoVentaRepository extends BaseRepository {
    constructor() {
        super(productoVenta);
    }

    async createVentaProductosCompleta({ total, carritoProductos, museoId, usuarioId, formaPagoId }) {
        return await sequelize.transaction(async (t) => {
            const nuevaVenta = await this.model.create({total, fechaVenta: new Date(), museoId, usuarioId, formaPagoId}, { transaction: t });
            const detallesData = await Promise.all(carritoProductos.map(async (producto) => {
                const articulo = await articuloRepository.findById(producto.articuloId);
                if (!articulo) {
                    throw new Error(`Artículo con ID ${producto.articuloId} no encontrado`);
                }
                
                // Preparar los datos para el registro de ProductoDetalle
                const cantidadNum = Number(producto.cantidad);
                const precioNum = Number(articulo.precioEstandar ?? articulo.precioVenta ?? 0);

                return {
                    cantidad: cantidadNum,
                    subTotal: cantidadNum * precioNum,
                    articuloId: producto.articuloId,
                    productoVentaId: nuevaVenta.id
                };
            }));

            const nuevosDetalles = await productoDetalleRepository.createMultiple(detallesData, { transaction: t });

            return {
                ...nuevaVenta.toJSON(),
                detalles: nuevosDetalles
            };
        });
    }

    async findAllAndCount({limit = 10, offset =0}){
        return await this.model.findAndCountAll({ limit, offset});
    }

    async findAllAndCountByMuseoId({museoId, limit = 10, offset =0}){
        return await this.model.findAndCountAll({ 
            where: { museoId }, limit, offset,
            include: [ { model: usuario, as: 'usuario', attributes: ['id', 'nombre'] } ]
        });
    }

    async findByIdWithChildren({id}) {
        return await this.model.findByPk(id, {
            include: [
                { model: usuario, as: 'usuario', attributes: ['id', 'nombre'] },
                { model: formaPago, as: 'formas_pago', attributes: ['id', 'nombre'] },
                {model : productoDetalle, as: 'producto_detalles',
                    include: [
                        { model: articulo, as: 'articulo', attributes: ['id', 'nombre'] }
                    ]
                }
            ]
        });
    }
}

export const productoVentaRepository = new ProductoVentaRepository();