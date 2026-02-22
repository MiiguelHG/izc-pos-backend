import express from "express";
import { BoletoEmitidoController } from "#controllers/boletoEmitidoController.js";
import { BoletoTipoValidationMiddleware, authJwt } from "#middlewares/index.js";

const router = express.Router();

router.use(authJwt.verifyToken);

router.put("/estado/:id", BoletoEmitidoController.updateBoletoEmitidoEstado);

router.post("/", BoletoTipoValidationMiddleware.verifyDiaVenta, BoletoEmitidoController.createVentaBoletos);
router.get("/", BoletoEmitidoController.getAllBoletosEmitidos);
router.get("/:id", BoletoEmitidoController.getBoletoEmitidoById);

export default router;