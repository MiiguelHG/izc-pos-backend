import express from "express";
import { ProductoVentaController } from "../controllers/productoVentaController.js";
import { authJwt } from "../middlewares/index.js";

const router = express.Router();
router.use(authJwt.verifyToken); // Protege todas las rutas con autenticación JWT

router.post("/", ProductoVentaController.createVentaProductosCompleta);

router.get("/", ProductoVentaController.getAllProductoVentas);

router.get("/:id", ProductoVentaController.getProductoVentaById);

router.get("/museo/:museoId", ProductoVentaController.getAllProductoVentasByMuseoId);

export default router;