import express from "express";
import { UsuarioController } from "../controllers/usuarioController.js";
import authJwt from "../middlewares/authJwt.js";

const router = express.Router();

// Rutas protegidas
router.get("/", authJwt.verifyToken, authJwt.isAdmin, UsuarioController.getAll);
router.get("/profile", authJwt.verifyToken, UsuarioController.getProfile);
router.get("/:id", authJwt.verifyToken, UsuarioController.getById);
router.put("/:id", authJwt.verifyToken, UsuarioController.update);
router.delete("/:id", authJwt.verifyToken, authJwt.isAdmin, UsuarioController.delete);

export default router;
