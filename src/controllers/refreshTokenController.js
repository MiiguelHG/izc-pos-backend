import RefreshTokenRepository from "../repositories/refreshTokenRepository.js";

const refreshTokenRepo = new RefreshTokenRepository();
export class RefreshTokenController {
    // Obtener todos los tokens activos de un usuario //
    static async getUserTokens(req, res){
        try{
            const id_usuario = req.id_usuario;
            const tokens = await refreshTokenRepo.findActiveByUserId(id_usuario);
            res.json(tokens);
        }catch(error){
            return res.status(500).json({ message: "Error al obtener tokens del usuario." });
        }
    }

    // Revocar un token específico //
    static async revokeToken(req, res){
        try{
            const { token } = req.body;
            const revoked = await refreshTokenRepo.revoke(token);

            if(!revoked)
                return res.status(404).json({ message: "Token not found." });

            return res.json({ message: "Token revoked successfully." });
        }catch(error){
            console.error("Error revoking token:", error);
            return res.status(500).json({ message: "Error al revocar el token." });
        }
    }

    // Limpiar tokens expirados //
    static async cleanupExpiredTokens(req, res){
        try{
            const deletedCount = await refreshTokenRepo.deleteExpiredTokens();
            res.json({ message: `Deleted ${deletedCount} expired tokens.` });
        }catch(error){
            console.error("Error cleaning up expired tokens:", error);
            return res.status(500).json({ message: "Error al limpiar tokens expirados." });
        }
    }
}