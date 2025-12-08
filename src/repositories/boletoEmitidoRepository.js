import BaseRepository from "./baseRepository.js";
import { boletoTipoRepository, boletoVentaRepository } from "./index.js";
import db from "../models/index.js";

const { boletoEmitido, sequelize , boletoVenta, visitante} = db;

class BoletoEmitidoRepository extends BaseRepository {
  constructor() {
    super(boletoEmitido);
  }

  async createVentaBoletosCompleta({ total, carritoBoletos, usuarioId, museoId, visitanteId, formaPagoId }) {
    return await sequelize.transaction(async (t) => {
      // Crear el registro de BoletoEmitido
      const nuevoBoletoEmitido = await this.model.create({total, usuarioId, museoId, visitanteId, formaPagoId}, { transaction: t });

      // Crear los registros a insertar en BoletoVenta asociados al BoletoEmitido
      const boletosVentaData = await Promise.all(carritoBoletos.map(async (boleto) => {
        // Obtener los datos del tipo de boleto para calcular el subtotal
        const boletoTipo = await boletoTipoRepository.findById(boleto.boletoTipoId);

        // Validar que el tipo de boleto exista
        if (!boletoTipo) {
          throw new Error(`Tipo de boleto con ID ${boleto.boletoTipoId} no encontrado`);
        }

        // Preparar los datos para el registro de BoletoVenta
        return {
          cantidad: boleto.cantidad,
          subTotal: boleto.cantidad * boletoTipo.precioFinal,
          boletoEmitidoId: nuevoBoletoEmitido.id,
          boletoTipoId: boleto.boletoTipoId
        };
      }));

      // Crear los registros a insertar en BoletoVenta asociados al BoletoEmitido
      const boletosCreados = await boletoVentaRepository.createMultiple(boletosVentaData, { transaction: t });

      // Retornar el boleto emitido con sus boletos de venta
      return {
        ...nuevoBoletoEmitido.toJSON(),
        boleto_ventas: boletosCreados
      };

    });
  }

  async findAllAndCount({ limit = 10, offset = 0 }) {
    return await this.model.findAndCountAll({ limit, offset });
  }

  async findAllAndCountByMuseoId({ museoId, limit = 10, offset = 0 }) {
    return await this.model.findAndCountAll({ 
      where: { museoId },
      include: [
        { model: visitante, as: 'visitante' },
        { model: boletoVenta, as: 'boleto_ventas' }
      ],
      order: [['fechaEmision', 'DESC']],
      limit, 
      offset 
    });
  }

  async findByIdWithChildren({id}) {
    return await this.model.findByPk(id, {
      include: [
        { model: boletoVenta, as: 'boleto_ventas' }
      ]
    });
  }
}

export const boletoEmitidoRepository = new BoletoEmitidoRepository();