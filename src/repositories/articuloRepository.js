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
}

export const articuloRepository = new ArticuloRepository();