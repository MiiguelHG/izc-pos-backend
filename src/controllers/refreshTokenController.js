//import RefreshTokenRepository from "../repositories/refreshTokenRepository.js";
import refreshTokenRepo from "../repositories/refreshTokenRepository.js";
import { sendSuccess } from "../utils/responseFormater.js";

//const refreshTokenRepo = new RefreshTokenRepository();

export class RefreshTokenController {
    // Obtener todos los tokens activos de un usuario //
    static async getUserTokens(req, res){
        try{
            const id_usuario = req.id_usuario;
            const tokens = await refreshTokenRepo.findActiveByUserId(id_usuario);
            sendSuccess(200, "User tokens retrieved successfully.", tokens, res);
            // res.json(tokens);
        }catch(error){
            sendError(res, 500, "Error al obtener tokens del usuario.");
        }
    }

    // Revocar un token específico //
    static async revokeToken(req, res){
        try{
            const { token } = req.body;
            const revoked = await refreshTokenRepo.revoke(token);

            if(!revoked)
                sendError(res, 404, "Token not found.");

            sendSuccess(res, 200, "Token revoked successfully.");
        }catch(error){
            console.error("Error revoking token:", error);
            sendError(res, 500, "Error al revocar el token.");
        }
    }

    // Limpiar tokens expirados //
    static async cleanupExpiredTokens(req, res){
        try{
            const deletedCount = await refreshTokenRepo.deleteExpiredTokens();
            sendSuccess(res, 200, `Deleted ${deletedCount} expired tokens.`);
            // res.json({ message: `Deleted ${deletedCount} expired tokens.` });
        }catch(error){
            console.error("Error cleaning up expired tokens:", error);
            sendError(res, 500, "Error al limpiar tokens expirados.");
        }
    }
}