import express from "express";
import { InvitadoController } from "#controllers/invitadoController.js";

const router = express.Router();  

router.get("/sin-ingreso", InvitadoController.getInvitadosSinIngreso);
router.put("/:id/boletoEmitido/:boletoEmitidoId", InvitadoController.marcarInvitadoUsado);

router.post("/", InvitadoController.createInvitado);
router.get("/", InvitadoController.getInvitados);
router.get("/:id", InvitadoController.getInvitadoById);

export default router;