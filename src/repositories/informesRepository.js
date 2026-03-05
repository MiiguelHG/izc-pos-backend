import BaseRepository from "./baseRepository.js";
import db from "../models/index.js";
import { buildVisitantesWhere, buildIngresosWhere, INGRESOS_CONFIG, getNormalizedRange, selectColumnaVisitantes } from "#utils/informeUtil.js";


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
            [this.model.sequelize.fn('DATE', this.model.sequelize.col('fechaRegistro')), 'fecha'],
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

  async findResumenVisitantes({fechaInicio, fechaFin, museoId, genero, cp, municipio, estado, nacionalidad, edadMin = 1, edadMax = 100}) {
    const colSelected = selectColumnaVisitantes(genero);

    const { fechaInicio: normalizedFechaInicio, fechaFin: normalizedFechaFin } = getNormalizedRange(fechaInicio, fechaFin);

    return await sequelize.query(`
      WITH resumenDiario AS (
        SELECT DATE(fechaRegistro) AS fecha, SUM(${colSelected}) AS total
        FROM visitantes
        WHERE fechaRegistro BETWEEN :normalizedFechaInicio AND :normalizedFechaFin 
        ${museoId ? 'AND museoId = :museoId' : ''}
        ${cp ? 'AND cp = :cp' : ''}
        ${municipio ? 'AND municipio = :municipio' : ''}
        ${estado ? 'AND estado = :estado' : ''}
        ${nacionalidad ? 'AND pais = :nacionalidad' : ''}
        AND edad BETWEEN :edadMin AND :edadMax
        GROUP BY DATE(fechaRegistro)
      )

      SELECT
        (SELECT SUM(total) FROM resumenDiario) as total,

        (SELECT total FROM resumenDiario ORDER BY total DESC LIMIT 1) as maximo,
        (SELECT fecha FROM resumenDiario ORDER BY total DESC LIMIT 1) as fechaMaximo,

        (SELECT total FROM resumenDiario WHERE total > 0 ORDER BY total ASC LIMIT 1) as minimo,
        (SELECT fecha FROM resumenDiario WHERE total > 0 ORDER BY total ASC LIMIT 1) as fechaMinimo

      
      `, {
        type: sequelize.QueryTypes.SELECT,
        replacements: { normalizedFechaInicio, normalizedFechaFin, museoId, cp, municipio, estado, nacionalidad, edadMin, edadMax }
      })
  }
  // ******** CONSULTAS PARA INFORMES DE INGRESOS ********

  async findIngresosByTipo({fechaInicio, fechaFin, museoId, formaPagoId, tipo = 'boletos'}) {

    const config = INGRESOS_CONFIG[tipo];
    
    if (!config) throw new Error(`Tipo de ingreso no válido: ${tipo}`);
    const { model: currentModel, dateField: currentDateField } = config;

    const whereClause = buildIngresosWhere({fechaInicio, fechaFin, museoId, formaPagoId, dateField: currentDateField});

    return await currentModel.findAll({
        where: whereClause,
        attributes: [
          [currentModel.sequelize.fn('DATE', currentModel.sequelize.col(currentDateField)), 'fecha'], 
          [currentModel.sequelize.fn('SUM', currentModel.sequelize.col('total')), 'total']
        ],
        group: [currentModel.sequelize.fn('DATE', currentModel.sequelize.col(currentDateField))],
        order: [[currentModel.sequelize.fn('DATE', currentModel.sequelize.col(currentDateField)), 'ASC']],
        raw: true
    });
  }

  async findResumenIngresosByTipo({fechaInicio, fechaFin, museoId, formaPagoId, tipo = 'boletos'}) {
    const config = INGRESOS_CONFIG[tipo];
    
    if (!config) throw new Error(`Tipo de ingreso no válido: ${tipo}`);
    const { model, dateField, tableName } = config;

    const { fechaInicio: normalizedFechaInicio, fechaFin: normalizedFechaFin } = getNormalizedRange(fechaInicio, fechaFin);

    return await sequelize.query(`
      WITH resumen AS (
        SELECT DATE(${dateField}) AS fecha, SUM(total) AS total
        FROM ${tableName}
        WHERE ${dateField} BETWEEN :normalizedFechaInicio AND :normalizedFechaFin 
        ${museoId ? 'AND museoId = :museoId' : ''}
        ${formaPagoId ? 'AND formaPagoId = :formaPagoId' : ''}
        GROUP BY DATE(${dateField})
      )
      SELECT
        (SELECT SUM(total) FROM resumen) as total,

        (SELECT total FROM resumen ORDER BY total DESC LIMIT 1) as maximo,
        (SELECT fecha FROM resumen ORDER BY total DESC LIMIT 1) as fechaMaximo,

        (SELECT total FROM resumen ORDER BY total ASC LIMIT 1) as minimo,
        (SELECT fecha FROM resumen ORDER BY total ASC LIMIT 1) as fechaMinimo
    `,{
      type: sequelize.QueryTypes.SELECT,
      replacements: { normalizedFechaInicio, normalizedFechaFin, museoId, formaPagoId }
    })
  }

  async findAllIngresosToInforme({fechaInicio = '', fechaFin = '', museoId = null, formaPagoId = null}) {
    const { fechaInicio: normalizedFechaInicio, fechaFin: normalizedFechaFin } = getNormalizedRange(fechaInicio, fechaFin);

    return await sequelize.query(`
      SELECT fecha, SUM(total) AS total
      FROM (
        SELECT DATE(fechaEmision) AS fecha, total
        FROM boletos_emitidos
        WHERE fechaEmision BETWEEN :normalizedFechaInicio AND :normalizedFechaFin
        ${museoId ? 'AND museoId = :museoId' : ''}
        ${formaPagoId ? 'AND formaPagoId = :formaPagoId' : ''}

        UNION ALL

        SELECT DATE(fechaVenta) as fecha, total
        FROM producto_ventas
        WHERE fechaVenta BETWEEN :normalizedFechaInicio AND :normalizedFechaFin
        ${museoId ? 'AND museoId = :museoId' : ''}
        ${formaPagoId ? 'AND formaPagoId = :formaPagoId' : ''}

        UNION ALL

        SELECT DATE(fechaReserva) as fecha, total
        FROM reserva_eventos
        WHERE fechaReserva BETWEEN :normalizedFechaInicio AND :normalizedFechaFin
        ${museoId ? 'AND museoId = :museoId' : ''}
        ${formaPagoId ? 'AND formaPagoId = :formaPagoId' : ''}
      ) AS Ingresos
      GROUP BY fecha
      ORDER BY fecha ASC
      `, {
        replacements: { normalizedFechaInicio, normalizedFechaFin, museoId, formaPagoId },
        type: sequelize.QueryTypes.SELECT
      }
    );
  }

 async findResumenAllIngresos ({fechaInicio, fechaFin, museoId, formaPagoId}) {
    const { fechaInicio: normalizedFechaInicio, fechaFin: normalizedFechaFin } = getNormalizedRange(fechaInicio, fechaFin);

    return await sequelize.query(`
      WITH resumen AS (
        SELECT fecha, SUM(ingresos.total) AS total
        FROM (
          SELECT DATE(fechaEmision) AS fecha, total
          FROM boletos_emitidos
          WHERE fechaEmision BETWEEN :normalizedFechaInicio AND :normalizedFechaFin
          ${museoId ? 'AND museoId = :museoId' : ''}
          ${formaPagoId ? 'AND formaPagoId = :formaPagoId' : ''}
          
          UNION ALL

          SELECT DATE(fechaVenta) as fecha, total
          FROM producto_ventas
          WHERE fechaVenta BETWEEN :normalizedFechaInicio AND :normalizedFechaFin
          ${museoId ? 'AND museoId = :museoId' : ''}
          ${formaPagoId ? 'AND formaPagoId = :formaPagoId' : ''}

          UNION ALL

          SELECT DATE(fechaReserva) as fecha, total
          FROM reserva_eventos
          WHERE fechaReserva BETWEEN :normalizedFechaInicio AND :normalizedFechaFin
          ${museoId ? 'AND museoId = :museoId' : ''}
          ${formaPagoId ? 'AND formaPagoId = :formaPagoId' : ''}
        ) AS ingresos
        GROUP BY fecha
      )
      SELECT
        (SELECT SUM(total) FROM resumen) as total,

        (SELECT total FROM resumen ORDER BY total DESC LIMIT 1) as maximo,
        (SELECT fecha FROM resumen ORDER BY total DESC LIMIT 1) as fechaMaximo,
        (SELECT total FROM resumen ORDER BY total ASC LIMIT 1) as minimo,
        (SELECT fecha FROM resumen ORDER BY total ASC LIMIT 1) as fechaMinimo
    `, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { normalizedFechaInicio, normalizedFechaFin, museoId, formaPagoId }
    }
  );
 }
}

export const informesRepository = new InformesRepository();