import { refreshTokenRepository } from "../repositories/index.js";
import { sendSuccess, sendError } from "../utils/responseFormater.js";

export class RefreshTokenController {
    // Obtener todos los tokens activos de un usuario //
    static async getUserTokens(req, res){
        try{
            const id_usuario = req.id_usuario;
            const tokens = await refreshTokenRepository.findActiveByUserId(id_usuario);

            return sendSuccess(res, 200, "User tokens retrieved successfully.", tokens);
        }catch(error){
            return sendError(res, 500, `Error al obtener tokens del usuario: ${error.message}`);
        }
    }

    // Revocar un token específico //
    static async revokeToken(req, res){
        try{
            const { token } = req.body;
            const revoked = await refreshTokenRepository.revoke(token);

            if(!revoked)
                return sendError(res, 404, "Token not found.");

            return sendSuccess(res, 200, "Token revoked successfully.");
        }catch(error){
            console.error("Error revoking token:", error);
            return sendError(res, 500, `Error al revocar el token: ${error.message}`);
        }
    }

    // Limpiar tokens expirados //
    static async cleanupExpiredTokens(req, res){
        try{
            const deletedCount = await refreshTokenRepository.deleteExpiredTokens();

            return sendSuccess(res, 200, `Deleted ${deletedCount} expired tokens.`);
        }catch(error){
            console.error("Error cleaning up expired tokens:", error);
            return sendError(res, 500, `Error al limpiar tokens expirados: ${error.message}`);
        }
    }
}