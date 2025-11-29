
// ESTE REPOSITORIO YA NO VA A FUNCIONAR


import BaseRepository from "./baseRepository.js";
import db from "../models/index.js";

const Producto = db.producto;

class ProductoRepository extends BaseRepository {
    constructor() {
        super(Producto);
    }

    async findByName(nombre){
        return await this.model.findOne({ where: { nombre } });
    }
}

const productoRepository = new ProductoRepository();
export default productoRepository;