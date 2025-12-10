import express from "express";
import { ProductoVentaController } from "../controllers/productoVentaController.js";
import { authJwt } from "../middlewares/index.js";

const router = express.Router();

router.post("/", ProductoVentaController.createVentaProductosCompleta);

router.get("/", ProductoVentaController.getAllProductoVentas);

router.get("/:id", ProductoVentaController.getProductoVentaById);

router.get("/museo/:museoId", ProductoVentaController.getAllProductoVentasByMuseoId);

export default router;