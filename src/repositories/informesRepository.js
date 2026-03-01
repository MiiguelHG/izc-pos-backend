import BaseRepository from "./baseRepository.js";
import db from "../models/index.js";
import { Op, or } from "sequelize";

const { visitante, boletoEmitido, productoVenta, reservaEvento, sequelize } = db;

class InformesRepository extends BaseRepository {
  constructor() {
      super(visitante);
  }

  async findVisitantesToInforme({fechaInicio = '', fechaFin = '', museoId = null, genero = '', cp = '', municipio = '', estado = '', nacionalidad = '', edadMin = 1, edadMax = 100}) {
    const whereClause = {};
    const colSelected = genero === 'masculino' ? 'cantidadHombres' : genero === 'femenino' ? 'cantidadMujeres' : genero === 'otros' ? 'cantidadOtros' : 'totalVisitantes';

    if (fechaInicio && fechaFin) {
        whereClause.fechaRegistro = { [Op.between]: [fechaInicio, fechaFin] };
    } else if (fechaInicio) {
        whereClause.fechaRegistro = { [Op.gte]: fechaInicio };
    } else if (fechaFin) {
        whereClause.fechaRegistro = { [Op.lte]: fechaFin };
    } else {
        whereClause.fechaRegistro = { [Op.between]: [new Date(0), new Date()] };
    }


    if (museoId) whereClause.museoId = museoId;
    if (genero) {
        if (genero === 'masculino') whereClause.cantidadHombres = { [Op.gt]: 0 };
        else if (genero === 'femenino') whereClause.cantidadMujeres = { [Op.gt]: 0 };
        else if (genero === 'otros') whereClause.cantidadOtros = { [Op.gt]: 0 };
    }
    if (cp) whereClause.cp = cp;
    if (municipio) whereClause.municipio = municipio;
    if (estado) whereClause.estado = estado;
    if (nacionalidad) whereClause.pais = nacionalidad;
    whereClause.edad = { [Op.between]: [edadMin, edadMax] };

    return await this.model.findAll({
        where: whereClause,
        attributes: [
            [this.model.sequelize.fn('DATE', this.model.sequelize.col('fechaRegistro')), 'fechaRegistro'],
            // 'fechaRegistro',
            [this.model.sequelize.fn('SUM', this.model.sequelize.col(colSelected)), 'total']
        ],
        group: [this.model.sequelize.fn('DATE', this.model.sequelize.col('fechaRegistro'))],
        // group: ['fechaRegistro'],
        order: [[this.model.sequelize.fn('DATE', this.model.sequelize.col('fechaRegistro')), 'ASC']],
        // order: [['fechaRegistro', 'ASC']],
        raw: true
    });
  }

  async findBoletosToInforme({fechaInicio = '', fechaFin = '', museoId = null, formaPagoId = null}) {
    const whereClause = {};
    if (fechaInicio && fechaFin) {
        whereClause.fechaEmision = { [Op.between]: [fechaInicio, fechaFin] };
    } else if (fechaInicio) {
        whereClause.fechaEmision = { [Op.gte]: fechaInicio };
    } else if (fechaFin) {
        whereClause.fechaEmision = { [Op.lte]: fechaFin };
    } else {
        whereClause.fechaEmision = { [Op.between]: [new Date(0), new Date()] };
    }

    if (museoId) whereClause.museoId = museoId;
    if (formaPagoId) whereClause.formaPagoId = formaPagoId;
    return await boletoEmitido.findAll({
        where: whereClause,
        attributes: [[boletoEmitido.sequelize.fn('DATE', boletoEmitido.sequelize.col('fechaEmision')), 'fechaRegistro'], [boletoEmitido.sequelize.fn('SUM', boletoEmitido.sequelize.col('total')), 'total']],
        group: [boletoEmitido.sequelize.fn('DATE', boletoEmitido.sequelize.col('fechaEmision'))],
        order: [[boletoEmitido.sequelize.fn('DATE', boletoEmitido.sequelize.col('fechaEmision')), 'ASC']],
        raw: true
    });
  }

  async findProductosToInforme({fechaInicio = '', fechaFin = '', museoId = null, formaPagoId = null}) {
    const whereClause = {};
    if (fechaInicio && fechaFin) {
        whereClause.fechaVenta = { [Op.between]: [fechaInicio, fechaFin] };
    } else if (fechaInicio) {
        whereClause.fechaVenta = { [Op.gte]: fechaInicio };
    } else if (fechaFin) {
        whereClause.fechaVenta = { [Op.lte]: fechaFin };
    } else {
        whereClause.fechaVenta = { [Op.between]: [new Date(0), new Date()] };
    }

    if (formaPagoId) whereClause.formaPagoId = formaPagoId;

    if (museoId) whereClause.museoId = museoId;

    return await productoVenta.findAll({
      where: whereClause,
      attributes: [[productoVenta.sequelize.fn('DATE', productoVenta.sequelize.col('fechaVenta')), 'fechaRegistro'], [productoVenta.sequelize.fn('SUM', productoVenta.sequelize.col('total')), 'total']],
      group: [productoVenta.sequelize.fn('DATE', productoVenta.sequelize.col('fechaVenta'))],
      order: [[productoVenta.sequelize.fn('DATE', productoVenta.sequelize.col('fechaVenta')), 'ASC']],
      raw: true
    });
  }

  async findEventosToInforme({fechaInicio = '', fechaFin = '', museoId = null, formaPagoId = null}) {
    const whereClause = {};
    if (fechaInicio && fechaFin) {
      whereClause.fechaInicio = { [Op.between]: [fechaInicio, fechaFin] };
    } else if (fechaInicio) {
      whereClause.fechaInicio = { [Op.gte]: fechaInicio };
    } else if (fechaFin) {
      whereClause.fechaInicio = { [Op.lte]: fechaFin };
    } else {
      whereClause.fechaInicio = { [Op.between]: [new Date(0), new Date()] };
    }

    if (museoId) whereClause.museoId = museoId;
    if (formaPagoId) whereClause.formaPagoId = formaPagoId;

    return await reservaEvento.findAll({
      where: whereClause,
      attributes: [[reservaEvento.sequelize.fn('DATE', reservaEvento.sequelize.col('fechaReserva')), 'fechaRegistro'], [reservaEvento.sequelize.fn('SUM', reservaEvento.sequelize.col('total')), 'total']],
      group: [reservaEvento.sequelize.fn('DATE', reservaEvento.sequelize.col('fechaReserva'))],
      order: [[reservaEvento.sequelize.fn('DATE', reservaEvento.sequelize.col('fechaReserva')), 'ASC']],
      raw: true
    }); 
  }

  async findAllIngresosToInforme({fechaInicio = '', fechaFin = '', museoId = null, formaPagoId = null}) {
    if (!fechaInicio) fechaInicio = new Date(0);
    if (!fechaFin) fechaFin = new Date();

    return await sequelize.query(`
      SELECT fechaRegistro, SUM(total) AS total
      FROM (
        SELECT DATE(fechaEmision) AS fechaRegistro, total
        FROM boletos_emitidos
        WHERE fechaEmision BETWEEN :fechaInicio AND :fechaFin
        ${museoId ? 'AND museoId = :museoId' : ''}
        ${formaPagoId ? 'AND formaPagoId = :formaPagoId' : ''}


        UNION ALL

        SELECT DATE(fechaVenta) as fechaRegistro, total
        FROM producto_ventas
        WHERE fechaVenta BETWEEN :fechaInicio AND :fechaFin
        ${museoId ? 'AND museoId = :museoId' : ''}
        ${formaPagoId ? 'AND formaPagoId = :formaPagoId' : ''}

        UNION ALL

        SELECT DATE(fechaReserva) as fechaRegistro, total
        FROM reserva_eventos
        WHERE fechaReserva BETWEEN :fechaInicio AND :fechaFin
        ${museoId ? 'AND museoId = :museoId' : ''}
        ${formaPagoId ? 'AND formaPagoId = :formaPagoId' : ''}
      ) AS Ingresos
      GROUP BY fechaRegistro
      ORDER BY fechaRegistro ASC
      `, {
        replacements: { fechaInicio, fechaFin, museoId, formaPagoId },
        type: sequelize.QueryTypes.SELECT
      });

  }

}

export const informesRepository = new InformesRepository();