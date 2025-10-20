//import ProductoRepository from "../repositories/productoRepository.js";
import productoRepository from "../repositories/productoRepository.js";
import { sendSuccess } from "../utils/responseFormater.js";


//const productoRepository = new ProductoRepository();


export class ProductoController {
    static async getAllProductos(req, res) {
        try {
            const productos = await productoRepository.findAllProductos();
            return sendSuccess(res, 200, "Productos obtenidos correctamente.", productos);
        } catch(error) {
            return sendError(res, 500, "Error al obtener productos.");
        }
    }

    static async getById(req, res) {
        try {
            const producto = await productoRepository.findById(req.params.id);
            if(!producto)
                return sendError(res, 404, "Producto no encontrado.");
            return sendSuccess(res, 200, "Producto obtenido correctamente.", producto);
        } catch(error) {
            return sendError(res, 500, "Error al obtener producto por ID.");
        }
    }

    static async createProduct(req, res) {
        try {
            const { nombre, precio, descripcion } = req.body;

            // Validar campos requeridos
            if(!nombre || !precio) {
                return sendError(res, 400, "Nombre y precio son obligatorios.");
            }

            // Validar si ya existe un producto con ese nombre
            const existing = await productoRepository.findByName(nombre);
            if(existing) {
                return sendError(res, 400, "Ya existe un producto con ese nombre.");
            }

            const newProduct = await productoRepository.createProduct({ 
                nombre, 
                precio, 
                descripcion 
            });
            return sendSuccess(res, 201, "Producto creado correctamente.", newProduct);
        } catch(error) {
            return sendError(res, 500, "Error al crear producto.");
        }
    }

    static async updateProduct(req, res) {
        try {
            const { nombre, precio, descripcion } = req.body;
            const producto = await productoRepository.findById(req.params.id);
            if(!producto)
                return sendError(res, 404, "Producto no encontrado.");
            
            const updatedProduct = await productoRepository.updateProduct(req.params.id, { 
                nombre, 
                precio, 
                descripcion 
            });
            return sendSuccess(res, 200, "Producto actualizado correctamente.", updatedProduct);
        } catch(error) {
            return sendError(res, 500, "Error al actualizar producto.");
        }
    }

    static async deleteProduct(req, res) {
        try {
            const producto = await productoRepository.findById(req.params.id);
            if(!producto)
                return sendError(res, 404, "Producto no encontrado.");
            
            await productoRepository.deleteProduct(req.params.id);
            return sendSuccess(res, 200, "Producto eliminado correctamente.");
        } catch(error) {
            return sendError(res, 500, "Error al eliminar producto.");
        }
    }
}