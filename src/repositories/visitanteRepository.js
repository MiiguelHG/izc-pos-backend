import BaseRepository from "./baseRepository.js";
import db from "../models/index.js";
import { Op, or } from "sequelize";


const { visitante } = db;

class VisitanteRepository extends BaseRepository {
    constructor() {
        super(visitante);
    }

    async findAllVisitantes({limit = 10, offset = 0}) {
        return await this.model.findAndCountAll({limit, offset});
    }

    async findAllVisitantesByMuseoId({museoId, limit = 10, offset = 0}) {
        return await this.model.findAndCountAll({
            where: { museoId },
            limit,
            offset
        });
    }

    async findVisitantesToInforme({fechaInicio = '', fechaFin = '', museoId = null, genero = '', cp = '', municipio = '', estado = '', nacionalidad = '', edadMin = 1, edadMax = 100}) {
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

        return await this.model.findAndCountAll({ 
            where: whereClause,
            attributes: {
                exclude: ['nombre', 'cp', 'pais', 'estado', 'municipio', 'edad', 'fechaRegistro'],
                include: [[this.model.sequelize.fn('DATE', this.model.sequelize.col('fechaRegistro')), 'fechaRegistro']]
            },
            order: [[this.model.sequelize.col('fechaRegistro'), 'ASC']]
        });
    }

}
export const visitanteRepository = new VisitanteRepository();