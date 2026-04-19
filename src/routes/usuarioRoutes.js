import express from "express";
import { UsuarioController } from "#controllers/usuarioController.js";
import { authJwt } from "../middlewares/index.js";

const router = express.Router();

router.use(authJwt.verifyToken);
router.use(authJwt.hasRole(['directorMuseo', 'admin']));
// Rutas protegidas
router.get("/", authJwt.hasRole(['directorMuseo', 'admin']), UsuarioController.getAll);
router.get("/:id", authJwt.hasRole(['directorMuseo', 'admin']), UsuarioController.getById);
router.put("/:id", authJwt.hasRole(['directorMuseo', 'admin']),UsuarioController.update);
router.put("/:id/toggle", authJwt.hasRole(['directorMuseo', 'admin']), UsuarioController.toggleActivo);

export default router;
