import express from "express";
import { AuthController } from "../controllers/authController.js";
import { verifySignUp, authJwt }  from "../middlewares/index.js";

const router = express.Router();

router.post("/register", [authJwt.verifyToken, authJwt.hasRole("admin"), verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExists], AuthController.register);

router.post("/login", AuthController.login);
router.post("/refresh", AuthController.refreshToken);
router.post("/logout", AuthController.logout);


export default router;