import express from "express";
import { InformesController } from "#controllers/informesController.js";
import { authJwt } from "#middlewares/index.js";

const router = express.Router();

router.use(authJwt.verifyToken);
router.get("/visitantes", InformesController.getVisitantesForInforme);
router.get("/ingresos", InformesController.getIngresosForInforme);

export default router;