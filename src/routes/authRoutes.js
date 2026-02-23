import express from "express";
import { AuthController } from "../controllers/authController.js";
import { verifySignUp, authJwt }  from "../middlewares/index.js";

const router = express.Router();

router.post("/register", [authJwt.verifyToken, authJwt.hasRole(['admin', 'directorMuseo']), verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExists], AuthController.register);

router.get("/me", authJwt.verifyToken, AuthController.getCurrentUser);
router.post("/login", AuthController.login);
router.put("/refresh", AuthController.refreshToken);
router.post("/logout", AuthController.logout);


export default router;