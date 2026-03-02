import { Op } from "sequelize";

const getDefaultLastYearRange = () => {
    const fechaFin = new Date();
    const fechaInicio = new Date();
    fechaInicio.setFullYear(fechaFin.getFullYear() - 1);
    return { fechaInicio, fechaFin };
};

const getNormalizedRange = (fechaInicio, fechaFin) => {
    if (fechaInicio && fechaFin) {
        return { fechaInicio, fechaFin };
    }

    if (fechaInicio && !fechaFin) {
        return { fechaInicio, fechaFin: new Date() };
    }

    if (!fechaInicio && fechaFin) {
        const startFromEnd = new Date(fechaFin);
        startFromEnd.setFullYear(startFromEnd.getFullYear() - 1);
        return { fechaInicio: startFromEnd, fechaFin };
    }

    return getDefaultLastYearRange();
};

export const buildVisitantesWhere = ({fechaInicio = '', fechaFin = '', museoId = null, genero = '', cp = '', municipio = '', estado = '', nacionalidad = '', edadMin = 1, edadMax = 100}) => {
  const whereClause = {};
  const colSelected = genero === 'masculino' ? 'cantidadHombres' : genero === 'femenino' ? 'cantidadMujeres' : genero === 'otros' ? 'cantidadOtros' : 'totalVisitantes';
  const normalizedRange = getNormalizedRange(fechaInicio, fechaFin);

  whereClause.fechaRegistro = { [Op.between]: [normalizedRange.fechaInicio, normalizedRange.fechaFin] };


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

  return { whereClause, colSelected };
}

export const bulidVisitantesWhere = buildVisitantesWhere;

export const buildIngresosWhere = ({fechaInicio = '', fechaFin = '', museoId = null, formaPagoId = null, dateField = 'fechaEmision'}) => {
  const whereClause = {};
  const normalizedRange = getNormalizedRange(fechaInicio, fechaFin);
  whereClause[dateField] = { [Op.between]: [normalizedRange.fechaInicio, normalizedRange.fechaFin] };

  if (museoId) whereClause.museoId = museoId;
  if (formaPagoId) whereClause.formaPagoId = formaPagoId;

  return whereClause;
}
