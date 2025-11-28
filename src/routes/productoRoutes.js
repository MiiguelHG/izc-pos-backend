import express from "express";
import { ProductoController } from "../controllers/productoController.js";
import { authJwt } from "../middlewares/index.js";

const router = express.Router();

// Rutas de básicas
router.get("/", [authJwt.verifyToken], ProductoController.getAllProductos);
router.get("/:id", [authJwt.verifyToken], ProductoController.getById);

// Rutas de gestión (admin)
router.post("/", [authJwt.verifyToken], ProductoController.createProduct);
router.put("/:id", [authJwt.verifyToken], ProductoController.updateProduct);
router.delete("/:id", [authJwt.verifyToken], ProductoController.deleteProduct);

export default router;
