import express from "express";
import { MuseoController } from "../controllers/museoController.js";

const router = express.Router();
// Rutas base
router.get("/", MuseoController.getAllMuseos);
router.post("/", MuseoController.createMuseo);

// Rutas para operaciones sobre un solo museo
router.get("/:id", MuseoController.getMuseoById);
router.put("/:id", MuseoController.updateMuseo);
router.delete("/:id", MuseoController.deleteMuseo);

export default router;