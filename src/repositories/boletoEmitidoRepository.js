import BaseRepository from "./baseRepository.js";
import { boletoTipoRepository, boletoVentaRepository } from "./index.js";
import db from "../models/index.js";

const { boletoEmitido, sequelize , boletoVenta, visitante, usuario, formaPago, boletoTipo} = db;

class BoletoEmitidoRepository extends BaseRepository {
  constructor() {
    super(boletoEmitido);
  }

  async createVentaBoletosCompleta({nombre, edad, cp, pais, estado, municipio, cantidadHombres, cantidadMujeres, cantidadOtros, total, carritoBoletos, usuarioId, museoId, formaPagoId }) {
    return await sequelize.transaction(async (t) => {
      // Proceso de registro del visitante
      const totalVisitantes = cantidadHombres + cantidadMujeres + cantidadOtros;

      if(totalVisitantes <= 0) {

        throw new Error("El total de visitantes debe ser mayor a cero.");
      }

      const newVisitante = await visitante.create({nombre, edad, cp, pais, estado, municipio, cantidadHombres, cantidadMujeres, cantidadOtros, totalVisitantes, museoId, usuarioId}, { transaction: t });

      if(!newVisitante){
        throw new Error("No se pudo crear el visitante.");
      }

      // Crear el registro de BoletoEmitido
      const nuevoBoletoEmitido = await this.model.create({total, usuarioId, museoId, visitanteId: newVisitante.id, formaPagoId}, { transaction: t });

      // Crear los registros a insertar en BoletoVenta asociados al BoletoEmitido
      const boletosVentaData = await Promise.all(carritoBoletos.map(async (boleto) => {
        // Obtener los datos del tipo de boleto para calcular el subtotal
        const boletoTipoDb = await boletoTipoRepository.findById(boleto.boletoTipoId);

        // Validar que el tipo de boleto exista
        if (!boletoTipoDb) {
          throw new Error(`Tipo de boleto con ID ${boleto.boletoTipoId} no encontrado`);
        }

        // Preparar los datos para el registro de BoletoVenta
        return {
          cantidad: boleto.cantidad,
          subTotal: boleto.cantidad * boletoTipoDb.precioFinal,
          boletoEmitidoId: nuevoBoletoEmitido.id,
          boletoTipoId: boleto.boletoTipoId
        };
      }));

      const totalBoletosVenta = boletosVentaData.reduce((sum, boleto) => sum + boleto.subTotal, 0);

      // Validar que el total de boletos venta coincida con el total registrado en BoletoEmitido
      if (totalBoletosVenta !== total) {
        throw new Error("El total calculado de boletos venta no coincide con el total registrado en la venta de boletos.");
      }

      const totalBoletosCantidad = boletosVentaData.reduce((sum, boleto) => sum + boleto.cantidad, 0);

      if (totalVisitantes !== totalBoletosCantidad) {
        throw new Error("La cantidad total de boletos vendidos no coincide con el total de visitantes registrado.");
      }

      // Crear los registros a insertar en BoletoVenta asociados al BoletoEmitido
      const boletosCreados = await boletoVentaRepository.createMultiple(boletosVentaData, { transaction: t });

      // Retornar el boleto emitido con sus boletos de venta
      return {
        ...nuevoBoletoEmitido.toJSON(),
        boleto_ventas: boletosCreados
      };

    });
  }

  async findAllAndCount({ limit = 10, offset = 0, museoId = null , search = ''}) {
    const whereClause = museoId ? { museoId } : {};
    const visitanteWhereClause = {};

    if (search) {
      visitanteWhereClause.nombre = { [Op.like]: `%${search}%` };
    }

    return await this.model.findAndCountAll({ 
      where: whereClause,
      include: [
        { model: visitante, as: 'visitante', attributes: { exclude: ['cantidadHombres', 'cantidadMujeres', 'cantidadOtros', 'totalVisitantes','edad', 'museoId', 'usuarioId']}, where: visitanteWhereClause },
        { model: usuario, as: 'usuario' , attributes: ['id', 'nombre'] }
      ],
      order: [['fechaEmision', 'DESC']],
      limit, 
      offset 
    });
  }

  async findByIdWithChildren({id}) {
    return await this.model.findByPk(id, {
      attributes: { exclude: ['visitanteId', 'usuarioId', 'formaPagoId'] },
      include: [
        { model: boletoVenta, as: 'boleto_ventas' , attributes: ['id', 'cantidad', 'subTotal'], include: [{ model: boletoTipo, as: 'boleto_tipo', attributes: ['id', 'nombre'] }] },
        {model: visitante, as: 'visitante', attributes: { exclude: ['museoId', 'usuarioId']} },
        {model: usuario, as: 'usuario', attributes: ['id', 'nombre']},
        {model: formaPago, as: 'formas_pago', attributes: ['id', 'nombre']}
      ],
    });
  }
}

export const boletoEmitidoRepository = new BoletoEmitidoRepository();