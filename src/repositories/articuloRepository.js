import BaseRepository from "./baseRepository.js";
import db from "../models/index.js";
import { where } from "sequelize";

const { articulo } = db;

class ArticuloRepository extends BaseRepository {
    constructor() {
        super(articulo);
    }

    async findAndCountAll ({ seleccion = '', limit, offset }) {
        const whereClause = seleccion ? { tipo: seleccion } : {};

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
}

export const articuloRepository = new ArticuloRepository();