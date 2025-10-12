import express from "express";
import { EventoController } from "../controllers/eventoController.js";
import { authJwt } from "../middlewares/index.js";

const router = express.Router();

// Rutas básicas
router.get("/", [authJwt.verifyToken], EventoController.getAllEventos);
router.get("/:id", [authJwt.verifyToken], EventoController.getById);

// Rutas de gestión (admin)
router.post("/", [authJwt.verifyToken, authJwt.isAdmin], EventoController.createEvent);
router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], EventoController.updateEvent);
router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], EventoController.deleteEvent);

export default router;
