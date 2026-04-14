import express from "express";
import { VisitanteController } from "#controllers/visitanteController.js";
import { authJwt } from "#middlewares/authJwt.js";

const router = express.Router();

router.use(authJwt.verifyToken);

router.get("/museo/:museoId", VisitanteController.getAllVisitantesByMuseoId);
router.get("/", VisitanteController.getAllVisitantes);
router.get("/:id", VisitanteController.getById);
router.post("/", VisitanteController.createVisitante);
router.put("/:id", VisitanteController.updateVisitante);


export default router;