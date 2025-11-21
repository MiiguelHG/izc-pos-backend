import express from "express";
import { BoletoTipoController } from "../controllers/boletoTipoController.js";

const router = express.Router();

router.put("/update-all/:articuloId", BoletoTipoController.UpdateAllBoletosPrecioFinal);

router.post("/", BoletoTipoController.createBoletoTipo);
router.get("/", BoletoTipoController.getBoletosTipos);
router.get("/:id", BoletoTipoController.getBoletoTipoById);
router.put("/:id", BoletoTipoController.boletoTipoUpdate);
router.delete("/:id", BoletoTipoController.boletoTipoDelete);

export default router;