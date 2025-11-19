import BaseRepository from "./baseRepository.js";
import db from "../models/index.js";

const { articulo } = db;

class ArticuloRepository extends BaseRepository {
    constructor() {
        super(articulo);
    }

    async createArticulo({ nombre, precio, descripcion, tipo }) {
        return await this.create({
            nombre,
            precioEstandar: precio,
            descripcion,
            tipo
        });
    }

    async getArticulo(){
        return await this.findAll();
    }

    async getArticuloById(id) {
        return await this.findById(id);
    }

    async updateArticulo(id, updateData) {
        return await this.update(id, updateData);
    }

    async deleteArticulo(id) {
        return await this.delete(id);
    }

    async obtenerPorTipo(tipo) {
        return await this.findAll({ where: { tipo } });
    }
}

export const articuloRepository = new ArticuloRepository();