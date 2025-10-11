import express from "express";
import { AuthController } from "../controllers/authController.js";
import { verifySignUp } from "../middlewares/index.js";

const router = express.Router();

router.post("/register", 
    verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExists, 
    AuthController.register);

router.post("/login", AuthController.login);
router.post("/refresh", AuthController.refreshToken);
router.post("/logout", AuthController.logout);


export default router;