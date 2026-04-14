import express from "express";
import { ProductoController } from "../controllers/productoController.js";
import { authJwt } from "../middlewares/index.js";

const router = express.Router();

router.use(authJwt.verifyToken);

// Rutas de básicas
router.get("/", ProductoController.getAllProductos);
router.get("/:id", ProductoController.getById);

router.use(authJwt.hasRole(['admin']));

// Rutas de gestión (admin)
router.post("/", ProductoController.createProduct);
router.put("/:id", ProductoController.updateProduct);
router.delete("/:id", ProductoController.deleteProduct);

export default router;
