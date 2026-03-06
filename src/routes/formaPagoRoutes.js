import express from "express";
import { FormaPagoController } from "../controllers/formaPagoController.js";
import { authJwt } from "#middlewares/index.js";


const router = express.Router();

router.use(authJwt.verifyToken);

router.get("/", FormaPagoController.getFormasPago);

router.use(authJwt.hasRole(['admin']));

router.post("/", FormaPagoController.createFormaPago);
router.put("/:id", FormaPagoController.updateFormaPago);
router.delete("/:id", FormaPagoController.deleteFormaPago);

export default router;