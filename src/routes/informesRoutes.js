import express from "express";
import { InformesController } from "#controllers/informesController.js";

const router = express.Router();

router.get("/visitantes", InformesController.getVisitantesForInforme);

export default router;