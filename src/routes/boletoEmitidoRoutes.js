import express from "express";
import { BoletoEmitidoController } from "#controllers/boletoEmitidoController.js";

const router = express.Router();

router.get("/museo/:museoId", BoletoEmitidoController.getBoletosEmitidosByMuseoId);
router.put("/estado/:id", BoletoEmitidoController.updateBoletoEmitidoEstado);

router.post("/", BoletoEmitidoController.createVentaBoletos);
router.get("/", BoletoEmitidoController.getAllBoletosEmitidos);
router.get("/:id", BoletoEmitidoController.getBoletoEmitidoById);

export default router;