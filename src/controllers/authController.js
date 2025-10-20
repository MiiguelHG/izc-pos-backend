import jwt from "jsonwebtoken";
// import UsuarioRepository from "../repositories/usuarioRepository.js";
// import RefreshTokenRepository from "../repositories/refreshTokenRepository.js";
import usuarioRepo from "../repositories/usuarioRepository.js";
import refreshTokenRepo from "../repositories/refreshTokenRepository.js";
import { sendSuccess, sendError } from "../utils/responseFormater.js";
import crypto from "crypto";


// const usuarioRepo = new UsuarioRepository();
// const refreshTokenRepo = new RefreshTokenRepository();

export class AuthController {
    static async register(req, res) {
        try{
            const { nombre, email, password, id_rol } = req.body;

            // const existing = await usuarioRepo.findByEmail(email);
            // if(existing)
            //     return res.status(400).json({ message: "Email is already in use!" });

            const user = await usuarioRepo.createUser({ nombre, email, password, id_rol });

            sendSuccess(res, 201, "User registered successfully!", {
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                id_rol: user.id_rol,
            });
        }catch(error){
            sendError(res, 500, error.message);
            // res.status(500).json({ message: error.message });
        }
    }

    static async login(req, res){
        try{
            const { email, password } = req.body;

            const user = await usuarioRepo.findByEmail(email);
            if(!user)
                sendError(res, 404, "User Not found.");
                // return res.status(404).json({ message: "User Not found." });

            const passwordIsValid = await usuarioRepo.validatePassword(user, password);
            if(!passwordIsValid)
                sendError(res, 401, "Invalid Password!", {
                accessToken: null,
                });
                // return res.status(401).json({
                //     accessToken: null,
                //     message: "Invalid Password!",
                // });

            //Tokens
            const accesToken = jwt.sign(
                { id: user.id, rol: user.id_rol },
                process.env.JWT_SECRET,
                { expiresIn: "15m" } // 15 minutes
            );

            const refreshToken = jwt.sign(
                { id: user.id },
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: "7d" } // 7 days
            );

            const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
            await refreshTokenRepo.create(tokenHash, user.id, expiresAt);

            sendSuccess(res, 200, "Login successful!", {
                accesToken,
                refreshToken,
                user: {
                    id: user.id,
                    nombre: user.nombre,
                    email: user.email,
                    id_rol: user.id_rol,
                },
            });
            // res.json({
            //     message: "Login successful!",
            //     accesToken,
            //     refreshToken,
            //     user: {
            //         id: user.id,
            //         nombre: user.nombre,
            //         email: user.email,
            //         id_rol: user.id_rol,
            //     },
            // });
        }catch(error){
            sendError(res, 500, error.message);
            // res.status(500).json({ message: error.message });
        }
    }

    static async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;

            console.log("Token", refreshToken)

            if (!refreshToken)
                sendError(res, 400, "Refresh token required!");
                // return res.status(400).json({ message: "Refresh token required!" });

            const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
            const storedToken = await refreshTokenRepo.findByToken(tokenHash);
            console.log(tokenHash);
            console.log(storedToken);

            if (!storedToken)
                sendError(res, 403, "Invalid refresh token!");

            if (storedToken.revoked_at)
                sendError(res, 403, "Refresh token has been revoked!");

            if (new Date() > storedToken.expires_at) {
                await refreshTokenRepo.revoke(tokenHash);
                sendError(res, 403, "Refresh token expired!");
            }

            // Verificar JWT del refresh token
            let payload;
            try {
                payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            } catch {
                await refreshTokenRepo.revoke(tokenHash);
                sendError(res, 403, "Invalid refresh token signature!");
            }

            const user = await usuarioRepo.findById(payload.id);
            if (!user)
                sendError(res, 404, "User not found!");

            // Generar nuevo access token
            const newAccessToken = jwt.sign(
                { id: user.id, rol: user.id_rol },
                process.env.JWT_SECRET,
                { expiresIn: "15m" }
            );

            // (opcional) Renovar el refresh token
            const newRefreshToken = jwt.sign(
                { id: user.id },
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: "7d" }
            );

            const newTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");
            const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

            await refreshTokenRepo.create(newTokenHash, user.id, newExpiresAt);
            await refreshTokenRepo.revoke(tokenHash);

            res.json({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            });
        } catch (error) {
            sendError(res, 500, error.message);
        }
    }

    static async logout(req, res) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken)
                sendError(res, 400, "Refresh token required!");

            const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
            const token = await refreshTokenRepo.findByToken(tokenHash);

            if (!token)
                sendError(res, 404, "Refresh token not found!");

            await refreshTokenRepo.revoke(tokenHash);

            res.json({ message: "Logout successful. Refresh token revoked." });
        } catch (error) {
            sendError(res, 500, error.message);
        }
    }
}