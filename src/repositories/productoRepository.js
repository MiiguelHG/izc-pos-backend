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

    async findById(id){
        return await this.model.findByPk(id);
    }

    async findAllProductos(){
        return await this.model.findAll();
    }

    async createProduct(data){
        return await this.model.create(data);
    }

    async updateProduct(id, data){
        const producto = await this.findById(id);
        if(!producto) throw new Error("Producto no encontrado");
        return await producto.update(data);
    }

    async deleteProduct(id){
        const producto = await this.findById(id);
        if(!producto) throw new Error("Producto no encontrado");
        return await producto.destroy();
    }
}

const productoRepository = new ProductoRepository();
export default productoRepository;