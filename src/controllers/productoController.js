import ProductoRepository from "../repositories/productoRepository.js";

const productoRepository = new ProductoRepository();

export class ProductoController {
    static async getAllProductos(req, res) {
        try {
            const productos = await productoRepository.findAllProductos();
            return res.json(productos);
        } catch(error) {
            return res.status(500).json({ message: "Error al obtener productos." });
        }
    }

    static async getById(req, res) {
        try {
            const producto = await productoRepository.findById(req.params.id);
            if(!producto)
                return res.status(404).json({ message: "Producto no encontrado." });
            return res.json(producto);
        } catch(error) {
            return res.status(500).json({ message: "Error al obtener producto por ID." });
        }
    }

    static async createProduct(req, res) {
        try {
            const { nombre, precio, descripcion } = req.body;

            // Validar campos requeridos
            if(!nombre || !precio) {
                return res.status(400).json({ message: "Nombre y precio son obligatorios." });
            }

            // Validar si ya existe un producto con ese nombre
            const existing = await productoRepository.findByName(nombre);
            if(existing) {
                return res.status(400).json({ message: "Ya existe un producto con ese nombre." });
            }

            const newProduct = await productoRepository.createProduct({ 
                nombre, 
                precio, 
                descripcion 
            });
            return res.status(201).json(newProduct);
        } catch(error) {
            return res.status(500).json({ message: "Error al crear producto." });
        }
    }

    static async updateProduct(req, res) {
        try {
            const { nombre, precio, descripcion } = req.body;
            const producto = await productoRepository.findById(req.params.id);
            if(!producto)
                return res.status(404).json({ message: "Producto no encontrado." });
            
            const updatedProduct = await productoRepository.updateProduct(req.params.id, { 
                nombre, 
                precio, 
                descripcion 
            });
            return res.json(updatedProduct);
        } catch(error) {
            return res.status(500).json({ message: "Error al actualizar producto." });
        }
    }

    static async deleteProduct(req, res) {
        try {
            const producto = await productoRepository.findById(req.params.id);
            if(!producto)
                return res.status(404).json({ message: "Producto no encontrado." });
            
            await productoRepository.deleteProduct(req.params.id);
            return res.json({ message: "Producto eliminado correctamente." });
        } catch(error) {
            return res.status(500).json({ message: "Error al eliminar producto." });
        }
    }
}