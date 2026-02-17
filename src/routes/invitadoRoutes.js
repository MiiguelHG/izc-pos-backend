import express from "express";
import { InvitadoController } from "#controllers/invitadoController.js";

const router = express.Router();  

router.put("/:id/boletoEmitido/:boletoEmitidoId", InvitadoController.marcarInvitadoUsado);
router.get("/:id/museo/:museoId", InvitadoController.getInvitadoByIdAndMuseoId);

router.post("/", InvitadoController.createInvitado);
router.get("/", InvitadoController.getInvitados);

export default router;