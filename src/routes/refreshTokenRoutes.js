import express from "express";
import { RefreshTokenController } from "../controllers/refreshTokencontroller.js";
import  authJwt  from "../middlewares/authJwt.js";

const router = express.Router();

// Obtener todos los tokens activos de un usuario (solo admin)
router.get("/user/:id", [authJwt.verifyToken, authJwt.isAdmin], RefreshTokenController.getUserTokens);

// Revocar un token manualmente
router.post("/revoke", [authJwt.verifyToken, authJwt.isAdmin], RefreshTokenController.revokeToken);

// Limpiar tokens expirados
router.delete("/cleanup", [authJwt.verifyToken, authJwt.isAdmin], RefreshTokenController.cleanupExpiredTokens);

export default router;
