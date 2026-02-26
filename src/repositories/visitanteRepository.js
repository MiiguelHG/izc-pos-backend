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
                // [this.model.sequelize.fn('DATE', this.model.sequelize.col('fechaRegistro')), 'fechaRegistro'],
                'fechaRegistro',
                [this.model.sequelize.fn('SUM', this.model.sequelize.col(colSelected)), 'total']
            ],
            // group: [this.model.sequelize.fn('DATE', this.model.sequelize.col('fechaRegistro'))],
            group: ['fechaRegistro'],
            // order: [[this.model.sequelize.fn('DATE', this.model.sequelize.col('fechaRegistro')), 'ASC']],
            order: [['fechaRegistro', 'ASC']],
            raw: true
        });
    }

}
export const visitanteRepository = new VisitanteRepository();