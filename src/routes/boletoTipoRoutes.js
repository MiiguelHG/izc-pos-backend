import express from "express";
import { BoletoTipoController } from "#controllers/boletoTipoController.js";
import { authJwt } from "#middlewares/index.js";

const router = express.Router();

router.use(authJwt.verifyToken);

router.put("/update-all", BoletoTipoController.UpdateAllBoletosPrecioFinal);
router.put("/:id/toggle", BoletoTipoController.toggleBoletoTipo);

router.post("/", BoletoTipoController.createBoletoTipo);
router.get("/", BoletoTipoController.getBoletosTipos);
router.get("/:id", BoletoTipoController.getBoletoTipoById);
router.put("/:id", BoletoTipoController.boletoTipoUpdate);

export default router;