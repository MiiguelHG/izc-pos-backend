import express from "express";
import { AccesoController } from "#controllers/accesoController.js";
import { authJwt } from "#middlewares/index.js";

const router = express.Router();

// router.use(authJwt.verifyToken);
router.post("/validar/:boletoEmitidoId", AccesoController.controlAcceso);

export default router;