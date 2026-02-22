import express from "express";
import { InvitadoController } from "#controllers/invitadoController.js";
import { authJwt }  from "../middlewares/index.js";

const router = express.Router();

router.use(authJwt.verifyToken);

router.put("/:id/boletoEmitido/:boletoEmitidoId", authJwt.hasRole(['operador']), InvitadoController.marcarInvitadoUsado);
router.get("/:id", InvitadoController.getInvitacionVigente);
router.put("/:id/cancelar", authJwt.hasRole(['admin', 'directorMuseo']), InvitadoController.cancelarInvitado);

router.post("/", authJwt.hasRole(['admin', 'directorMuseo']), InvitadoController.createInvitado);
router.get("/", InvitadoController.getInvitados);
router.put("/:id", authJwt.hasRole(['admin', 'directorMuseo']), InvitadoController.updateInvitado);

export default router;