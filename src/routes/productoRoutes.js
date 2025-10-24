import express from "express";
import { ProductoController } from "../controllers/productoController.js";
import authJwt from "../middlewares/authJwt.js";

const router = express.Router();

// Rutas de básicas
router.get("/", [authJwt.verifyToken], ProductoController.getAllProductos);
router.get("/:id", [authJwt.verifyToken], ProductoController.getById);

// Rutas de gestión (admin)
router.post("/", [authJwt.verifyToken, authJwt.isAdmin], ProductoController.createProduct);
router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], ProductoController.updateProduct);
router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], ProductoController.deleteProduct);

export default router;
