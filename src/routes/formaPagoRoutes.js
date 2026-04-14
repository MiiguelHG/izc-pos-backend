import express from "express";
import { FormaPagoController } from "../controllers/formaPagoController.js";
import { authJwt } from "#middlewares/index.js";


const router = express.Router();
router.use(authJwt.verifyToken);

router.get("/", FormaPagoController.getFormasPago);

router.post("/", authJwt.hasRole(['admin']), FormaPagoController.createFormaPago);
router.put("/:id", authJwt.hasRole(['admin']), FormaPagoController.updateFormaPago);
router.put("/:id/toggle", authJwt.hasRole(['admin']), FormaPagoController.toggleActivo);

export default router;