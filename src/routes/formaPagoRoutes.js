import express from "express";
import { FormaPagoController } from "../controllers/formaPagoController.js";


const router = express.Router();

router.get("/", FormaPagoController.getFormasPago);
router.post("/", FormaPagoController.createFormaPago);
router.put("/:id", FormaPagoController.updateFormaPago);
router.delete("/:id", FormaPagoController.deleteFormaPago);

export default router;