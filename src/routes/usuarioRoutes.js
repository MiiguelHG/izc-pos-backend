import express from "express";
import { UsuarioController } from "#controllers/usuarioController.js";
import { authJwt } from "../middlewares/index.js";

const router = express.Router();

router.use(authJwt.verifyToken);
router.use(authJwt.hasRole(['directorMuseo', 'admin']));
// Rutas protegidas
router.get("/",UsuarioController.getAll);
router.get("/:id", UsuarioController.getById);
router.put("/:id", UsuarioController.update);
router.put("/:id/toggle", UsuarioController.toggleActivo);

export default router;
