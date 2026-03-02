import BaseRepository from "./baseRepository.js";
import db from "../models/index.js";
import { buildVisitantesWhere, buildIngresosWhere, INGRESOS_CONFIG } from "#utils/informeUtil.js";


const { visitante, sequelize } = db;

class InformesRepository extends BaseRepository {

  constructor() {
      super(visitante);
  }

  async findVisitantesToInforme({fechaInicio, fechaFin, museoId, genero, cp, municipio, estado, nacionalidad, edadMin, edadMax}) {

    const { whereClause, colSelected } = buildVisitantesWhere({fechaInicio, fechaFin, museoId, genero, cp, municipio, estado, nacionalidad, edadMin, edadMax});

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

  async findTotalVisitantes({fechaInicio , fechaFin, museoId, genero, cp, municipio, estado, nacionalidad, edadMin = 1, edadMax}) {

    const { whereClause, colSelected } = buildVisitantesWhere({fechaInicio, fechaFin, museoId, genero, cp, municipio, estado, nacionalidad, edadMin, edadMax});

    return await this.model.findAll({
      where: whereClause,
      attributes: [[this.model.sequelize.fn('SUM', this.model.sequelize.col(colSelected)), 'total']],
      raw: true
    })
  }

  async findMaxMinVisitantesFecha({fechaInicio, fechaFin, museoId, genero, cp, municipio, estado, nacionalidad, edadMin, edadMax}) {

    const { whereClause, colSelected } = buildVisitantesWhere({fechaInicio, fechaFin, museoId, genero, cp, municipio, estado, nacionalidad, edadMin, edadMax});

    const visitantes = await this.model.findAll({
      where: whereClause,
      group: [this.model.sequelize.fn('DATE', this.model.sequelize.col('fechaRegistro'))],
      attributes: [
        [this.model.sequelize.fn('DATE', this.model.sequelize.col('fechaRegistro')), 'fechaRegistro'],
        [this.model.sequelize.fn('SUM', this.model.sequelize.col(colSelected)), 'total'],
      ],
      order: [[this.model.sequelize.fn('SUM', this.model.sequelize.col(colSelected)), 'DESC']],
      raw: true
    });

    return visitantes.length > 0 ? { max: visitantes[0], min: visitantes[visitantes.length - 1] } : null;
  }

  // ******** CONSULTAS PARA INFORMES DE INGRESOS ********

  async findIngresosByTipo({fechaInicio = '', fechaFin = '', museoId = null, formaPagoId = null, tipo = 'boletos'}) {

    const config = INGRESOS_CONFIG[tipo];
    
    if (!config) throw new Error(`Tipo de ingreso no válido: ${tipo}`);
    const { model: currentModel, dateField: currentDateField } = config;

    const whereClause = buildIngresosWhere({fechaInicio, fechaFin, museoId, formaPagoId, dateField: currentDateField});

    return await currentModel.findAll({
        where: whereClause,
        attributes: [
          [currentModel.sequelize.fn('DATE', currentModel.sequelize.col(currentDateField)), 'fechaRegistro'], 
          [currentModel.sequelize.fn('SUM', currentModel.sequelize.col('total')), 'total']
        ],
        group: [currentModel.sequelize.fn('DATE', currentModel.sequelize.col(currentDateField))],
        order: [[currentModel.sequelize.fn('DATE', currentModel.sequelize.col(currentDateField)), 'ASC']],
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