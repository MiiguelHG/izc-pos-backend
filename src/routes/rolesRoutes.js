import express from "express";
import { RolController } from "../controllers/rolController.js";
import  { authJwt } from "../middlewares/index.js";

const router = express.Router();

router.use(authJwt.verifyToken);

// Solo los administradores pueden gestionar roles
router.get("/", RolController.getAllRoles);
router.get("/:id", RolController.getById);
router.post("/", RolController.createRole);
router.put("/:id", RolController.updateRole);

export default router;
