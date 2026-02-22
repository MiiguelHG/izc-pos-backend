import express from "express";
import { BoletoTipoController } from "#controllers/boletoTipoController.js";
import { authJwt } from "#middlewares/index.js";

const router = express.Router();

router.use(authJwt.verifyToken);

router.put("/update-all", authJwt.hasRole(['admin']) ,BoletoTipoController.UpdateAllBoletosPrecioFinal);
router.put("/:id/toggle", authJwt.hasRole(['admin']), BoletoTipoController.toggleBoletoTipo);

router.post("/",authJwt.hasRole(['admin']), BoletoTipoController.createBoletoTipo);
router.get("/", BoletoTipoController.getBoletosTipos);
router.get("/:id", BoletoTipoController.getBoletoTipoById);
router.put("/:id", authJwt.hasRole(['admin']), BoletoTipoController.boletoTipoUpdate);

export default router;