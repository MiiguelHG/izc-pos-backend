import express from "express";
import { EventoController } from "../controllers/eventoController.js";
import { authJwt } from "#middlewares/index.js";

const router = express.Router();

router.use(authJwt.verifyToken);

// Rutas básicas
router.get("/", EventoController.getAllEventos);
router.get("/:id", EventoController.getById);

// Rutas de gestión (admin)
router.post("/", EventoController.createEvent);
router.put("/:id", EventoController.updateEvent);
router.delete("/:id", EventoController.deleteEvent);

export default router;
