import express from "express";
import { InvitadoController } from "#controllers/invitadoController.js";

const router = express.Router();  

router.put("/:id/boletoEmitido/:boletoEmitidoId", InvitadoController.marcarInvitadoUsado);
router.get("/:id/museo/:museoId", InvitadoController.getInvitacionVigente);
router.put("/:id/cancelar", InvitadoController.cancelarInvitado);

router.post("/", InvitadoController.createInvitado);
router.get("/", InvitadoController.getInvitados);
router.put("/:id", InvitadoController.updateInvitado);

export default router;