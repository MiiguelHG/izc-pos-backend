import jwt from "jsonwebtoken";
import usuarioRepo from "../repositories/usuarioRepository.js";
import RefreshTokenRepository from "../repositories/refreshTokenRepository.js";
import crypto from "crypto";


const refreshTokenRepo = new RefreshTokenRepository();

export class AuthController {
    static async register(req, res) {
        try{
            const { nombre, email, password, rolId } = req.body;

            // const existing = await usuarioRepo.findByEmail(email);
            // if(existing)
            //     return res.status(400).json({ message: "Email is already in use!" });

            const user = await usuarioRepo.createUser({ nombre, email, password, rolId });

            res.status(201).json({
                message: "User registered successfully!",
                user: {
                    id: user.id,
                    nombre: user.nombre,
                    email: user.email,
                },
            });
        }catch(error){
            res.status(500).json({ message: error.message });
        }
    }

    static async login(req, res){
        try{
            const { email, password } = req.body;

            const user = await usuarioRepo.findByEmail(email);
            if(!user)
                return res.status(404).json({ message: "User Not found." });

            const passwordIsValid = await usuarioRepo.validatePassword(user, password);
            if(!passwordIsValid)
                return res.status(401).json({
                    accessToken: null,
                    message: "Invalid Password!",
                });

            //Tokens
            const accesToken = jwt.sign(
                { id: user.id, rol: user.rolId },
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

            res.json({
                message: "Login successful!",
                accesToken,
                refreshToken,
                user: {
                    id: user.id,
                    nombre: user.nombre,
                    email: user.email,
                    rolId: user.rolId,
                },
            });
        }catch(error){
            res.status(500).json({ message: error.message });
        }
    }

    static async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;

            console.log("Token", refreshToken)

            if (!refreshToken)
                return res.status(400).json({ message: "Refresh token required!" });

            const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
            const storedToken = await refreshTokenRepo.findByToken(tokenHash);
            console.log(tokenHash);
            console.log(storedToken);

            if (!storedToken)
                return res.status(403).json({ message: "Invalid refresh token!" });

            if (storedToken.revoked_at)
                return res.status(403).json({ message: "Refresh token has been revoked!" });

            if (new Date() > storedToken.expires_at) {
                await refreshTokenRepo.revoke(tokenHash);
                return res.status(403).json({ message: "Refresh token expired!" });
            }

            // Verificar JWT del refresh token
            let payload;
            try {
                payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            } catch {
                await refreshTokenRepo.revoke(tokenHash);
                return res.status(403).json({ message: "Invalid refresh token signature!" });
            }

            const user = await usuarioRepo.findById(payload.id);
            if (!user)
                return res.status(404).json({ message: "User not found!" });

            // Generar nuevo access token
            const newAccessToken = jwt.sign(
                { id: user.id, rol: user.rolId },
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
            res.status(500).json({ message: error.message });
        }
    }

    static async logout(req, res) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken)
                return res.status(400).json({ message: "Refresh token required!" });

            const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
            const token = await refreshTokenRepo.findByToken(tokenHash);

            if (!token)
                return res.status(404).json({ message: "Refresh token not found!" });

            await refreshTokenRepo.revoke(tokenHash);

            res.json({ message: "Logout successful. Refresh token revoked." });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

