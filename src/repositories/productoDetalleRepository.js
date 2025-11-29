import BaseRepository from "./baseRepository.js";
import db from "../models/index.js";

const { productoDetalle } = db;

class ProductoDetalleRepository extends BaseRepository {
    constructor() {
        super(productoDetalle);
    }

    createMultiple(productoData = [], options = {}) {
        return this.model.bulkCreate(productoData, options);
    }
}

export const productoDetalleRepository = new ProductoDetalleRepository();