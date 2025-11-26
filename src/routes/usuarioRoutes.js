import express from "express";
import { UsuarioController } from "#controllers/usuarioController.js";
import { authJwt } from "../middlewares/index.js";

const router = express.Router();

// Rutas protegidas
router.get("/", UsuarioController.getAll);
// router.get("/profile", UsuarioController.getProfile);
router.get("/:id", UsuarioController.getById);
router.put("/:id", UsuarioController.update);
router.delete("/:id", UsuarioController.delete);

export default router;
