import { Op } from "sequelize";
import db from "../models/index.js";

const { boletoEmitido, productoVenta, reservaEvento } = db;

export const INGRESOS_CONFIG = {
    boletos: { model: boletoEmitido, dateField: 'fechaEmision', tableName: 'boletos_emitidos' },
    productos: { model: productoVenta, dateField: 'fechaVenta', tableName: 'producto_ventas' },
    eventos: { model: reservaEvento, dateField: 'fechaReserva', tableName: 'reserva_eventos' }
  };

const parseDate = (fechaStr) => {
  if (!fechaStr) return null;
  
  // Si es string, parsear YYYY-MM-DD
  if (typeof fechaStr === 'string') {
    const [year, month, day] = fechaStr.split('-').map(Number);
    // Crear fecha usando zona local (NO UTC) para evitar desplazamientos
    return new Date(year, month - 1, day, 0, 0, 0, 0);
  }
  
  // Si ya es Date, retornar como está
  return fechaStr instanceof Date ? fechaStr : null;
};

const setEndOfDay = (fecha) => {
  if (!fecha || !(fecha instanceof Date)) return fecha;
  
  const endDate = new Date(fecha);
  endDate.setHours(23, 59, 59, 999);
  return endDate;
};

const getDefaultLastYearRange = () => {
    const fechaFin = new Date();
    const fechaInicio = new Date();
    fechaInicio.setFullYear(fechaFin.getFullYear() - 1);
    return { fechaInicio, fechaFin: setEndOfDay(fechaFin) };
};

export const getNormalizedRange = (fechaInicio, fechaFin) => {
    if (fechaInicio && fechaFin) {
        // Convertir strings a Date objects y aplicar 23:59:59 a fechaFin
        const inicio = parseDate(fechaInicio);
        const fin = setEndOfDay(parseDate(fechaFin));
        return { fechaInicio: inicio, fechaFin: fin };
    }

    if (fechaInicio && !fechaFin) {
        // Si solo hay fechaInicio, usar hoy como fechaFin con 23:59:59
        const inicio = parseDate(fechaInicio);
        const fin = setEndOfDay(new Date());
        return { fechaInicio: inicio, fechaFin: fin };
    }

    if (!fechaInicio && fechaFin) {
        // Si solo hay fechaFin, calcular hace 1 año desde esa fecha
        const fin = setEndOfDay(parseDate(fechaFin));
        const inicio = new Date(fin);
        inicio.setFullYear(inicio.getFullYear() - 1);
        return { fechaInicio: inicio, fechaFin: fin };
    }

    // Si no hay fechas, usar rango por defecto (últimos 12 meses)
    return getDefaultLastYearRange();
};

export const selectColumnaVisitantes = (genero) => {
  switch (genero) {
    case 'masculino':
      return 'cantidadHombres';
    case 'femenino':
      return 'cantidadMujeres';
    case 'otros':
      return 'cantidadOtros';
    default:
      return 'totalVisitantes';
  }
};

export const buildVisitantesWhere = ({fechaInicio = '', fechaFin = '', museoId = null, genero = '', cp = '', municipio = null, estado = null, nacionalidad = '', edadMin = 1, edadMax = 100}) => {
  const whereClause = {};
  const colSelected = selectColumnaVisitantes(genero);
  const normalizedRange = getNormalizedRange(fechaInicio, fechaFin);

  whereClause.fechaRegistro = { [Op.between]: [normalizedRange.fechaInicio, normalizedRange.fechaFin] };


  if (museoId) whereClause.museoId = museoId;
  if (genero) {
      if (genero === 'masculino') whereClause.cantidadHombres = { [Op.gt]: 0 };
      else if (genero === 'femenino') whereClause.cantidadMujeres = { [Op.gt]: 0 };
      else if (genero === 'otros') whereClause.cantidadOtros = { [Op.gt]: 0 };
  }
  if (cp) whereClause.cp = cp;
  if (municipio) whereClause.municipioId = municipio;
  if (estado) whereClause.estadoId = estado;
  if (nacionalidad) {
    nacionalidad === 'internacional' ? whereClause.pais = { [Op.ne]: 'México' } : whereClause.pais = 'México';
  }
  whereClause.edad = { [Op.between]: [edadMin, edadMax] };

  return { whereClause, colSelected };
}

export const buildIngresosWhere = ({fechaInicio = '', fechaFin = '', museoId = null, formaPagoId = null, dateField = 'fechaEmision'}) => {
  const whereClause = {};
  const normalizedRange = getNormalizedRange(fechaInicio, fechaFin);
  whereClause[dateField] = { [Op.between]: [normalizedRange.fechaInicio, normalizedRange.fechaFin] };

  if (museoId) whereClause.museoId = museoId;
  if (formaPagoId) whereClause.formaPagoId = formaPagoId;

  return whereClause;
}

export const rellenarFechasFaltantes = (dataDB = []) => {
  if (!dataDB || dataDB.length === 0) return [];

  const mapaDatos = {};
  dataDB.forEach(item => {
    mapaDatos[item.fecha] = item.total;
  });

  let countDiasCero = 0;

  const dataCompleta = [];
  const fechaInicio = new Date(dataDB[0].fecha);
  const fechaFin = new Date(dataDB[dataDB.length - 1].fecha);

  for (let fecha = fechaInicio; fecha <= fechaFin; fecha.setDate(fecha.getDate() + 1)) {
    const fechaStr = fecha.toISOString().split('T')[0];

    const totalDia = mapaDatos[fechaStr] || 0;
    if (totalDia === 0) countDiasCero++;

    dataCompleta.push({
      fecha: fechaStr,
      total: totalDia
    });
  }

  return [dataCompleta, countDiasCero];
}

export const calcularPromedio = (total, numDias) => {
  if (numDias === 0) return 0;
  return total / numDias;
}
