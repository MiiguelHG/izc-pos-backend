import express from "express";
import { MuseoController } from "../controllers/museoController.js";
import { authJwt } from "#middlewares/index.js";

const router = express.Router();
router.use(authJwt.verifyToken); // Middleware de autenticación para todas las rutas de este router
// Rutas base


router.get("/all", MuseoController.getAllMuseos);
router.get("/", MuseoController.getAndCountAllMuseos);
router.post("/", authJwt.hasRole(["admin"]), MuseoController.createMuseo);

// Rutas para operaciones sobre un solo museo
router.get("/:id", MuseoController.getMuseoById);
router.put("/:id", authJwt.hasRole(["admin"]), MuseoController.updateMuseo);

export default router;