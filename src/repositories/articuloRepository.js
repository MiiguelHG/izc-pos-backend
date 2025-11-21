import BaseRepository from "./baseRepository.js";
import db from "../models/index.js";

const { articulo } = db;

class ArticuloRepository extends BaseRepository {
    constructor() {
        super(articulo);
    }

    async getArticuloById(id) {
        return await this.findById(id);
    }
    
    async obtenerPorTipo(tipo) {
        return await this.findAll({ where: { tipo } });
    }
}

export const articuloRepository = new ArticuloRepository();