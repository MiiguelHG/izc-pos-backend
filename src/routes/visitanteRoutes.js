import express from "express";
import { VisitanteController } from "../controllers/visitanteController.js";
import { authJwt } from "../middlewares/index.js";

const router = express.Router();

// Rutas básicas
router.get("/", [authJwt.verifyToken, authJwt.isAdmin], VisitanteController.getAllVisitantes);
router.get("/:id", [authJwt.verifyToken, authJwt.isAdmin], VisitanteController.getById);

// Rutas de filtrado/reportes
router.get("/tipo/grupos", [authJwt.verifyToken, authJwt.isAdmin], VisitanteController.getGroupVisitors);
router.get("/tipo/individuales", [authJwt.verifyToken, authJwt.isAdmin], VisitanteController.getIndividualVisitors);
router.get("/pais/:pais", [authJwt.verifyToken, authJwt.isAdmin], VisitanteController.getByCountry);
router.get("/genero/:genero", [authJwt.verifyToken, authJwt.isAdmin], VisitanteController.getByGender);

// Rutas de gestión (admin)
router.post("/", [authJwt.verifyToken, authJwt.isAdmin], VisitanteController.createVisitor);
router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], VisitanteController.updateVisitor);
router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], VisitanteController.deleteVisitor);

export default router;