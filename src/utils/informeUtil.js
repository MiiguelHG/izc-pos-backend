import { Op } from "sequelize";

export const buildVisitantesWhere = ({fechaInicio = '', fechaFin = '', museoId = null, genero = '', cp = '', municipio = '', estado = '', nacionalidad = '', edadMin = 1, edadMax = 100}) => {
  const whereClause = {};

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

  return whereClause;
}

export const bulidVisitantesWhere = buildVisitantesWhere;

export const buildIngresosWhere = ({fechaInicio = '', fechaFin = '', museoId = null, formaPagoId = null, dateField = 'fechaEmision'}) => {
  const whereClause = {};
  if (fechaInicio && fechaFin) {
      whereClause[dateField] = { [Op.between]: [fechaInicio, fechaFin] };
  } else if (fechaInicio) {
      whereClause[dateField] = { [Op.gte]: fechaInicio };
  } else if (fechaFin) {
      whereClause[dateField] = { [Op.lte]: fechaFin };
  } else {
      whereClause[dateField] = { [Op.between]: [new Date(0), new Date()] };
  }

  if (museoId) whereClause.museoId = museoId;
  if (formaPagoId) whereClause.formaPagoId = formaPagoId;

  return whereClause;
}
