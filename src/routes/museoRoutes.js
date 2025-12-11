import express from "express";
import { MuseoController } from "../controllers/museoController.js";

const router = express.Router();
// Rutas base
router.get("/", MuseoController.getAllMuseos);
router.post("/", MuseoController.createMuseo);

// Rutas para manejar relación Museo - Articulo 
router.get("/:id/articulos", MuseoController.getArticulosByMuseoId);
router.post("/:id/articulos/:articuloId", MuseoController.addArticulo);
router.delete("/:id/articulos/:articuloId", MuseoController.removeArticulo);
router.put("/:id/articulos", MuseoController.setArticulos);

// Rutas para operaciones sobre un solo museo
router.get("/:id", MuseoController.getMuseoById);
router.put("/:id", MuseoController.updateMuseo);
router.delete("/:id", MuseoController.deleteMuseo);

export default router;