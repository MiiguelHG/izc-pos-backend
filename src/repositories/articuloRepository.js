import BaseRepository from "./baseRepository.js";
import db from "../models/index.js";
import { Op } from "sequelize";

const { articulo, museo } = db;

class ArticuloRepository extends BaseRepository {
    constructor() {
        super(articulo);
    }

    async findAndCountAll ({ seleccion = '', limit, offset }) {
        const defalutClause = { [Op.or]: [ {tipo: 'servicio'}, {tipo: 'producto'}] };
        const whereClause = seleccion ? { tipo: seleccion } : defalutClause;

        return await this.model.findAndCountAll({
            where: whereClause,
            limit,
            offset
        })
    }

    async getArticuloById(id) {
        return await this.findById(id);
    }
    
    async obtenerPorTipo(tipo) {
        return await this.findAll({ where: { tipo } });
    }

    async obtenerServiciosPorMuseo(museoId) {
        return await this.model.findAll({
            where: { tipo: 'servicio' },
            include: [{
                model: museo, as: 'museos',
                where: { id: museoId },
                through: { attributes: [] }
            }]
        });
    }

}

export const articuloRepository = new ArticuloRepository();