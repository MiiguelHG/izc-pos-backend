import express from "express";
import { RolController } from "../controllers/rolController.js";
import  authJwt  from "../middlewares/authJwt.js";

const router = express.Router();

// Solo los administradores pueden gestionar roles
router.get("/", [authJwt.verifyToken, authJwt.isAdmin], RolController.getAllRoles);
router.get("/:id", [authJwt.verifyToken, authJwt.isAdmin], RolController.getById);
router.post("/", [authJwt.verifyToken, authJwt.isAdmin], RolController.createRole);
router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], RolController.updateRole);
router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], RolController.deleteRole);

export default router;
