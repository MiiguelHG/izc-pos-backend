import db from "../models/index.js";
import BaseRepository from "./baseRepository.js";

const { refreshToken } = db;

class RefreshTokenRepository extends BaseRepository{
    constructor(){
        super(refreshToken);
    }

    // Buscar un token por su valor //
    async findByToken(token){
        return await refreshToken.findOne({ 
            where: { token: token }, 
        });
    }

    // Obtener todos los tokens de un usuario //
    async findActiveByUserId(usuarioId){
        const now = new Date();
        return await refreshToken.findAll({
            where: { 
                usuarioId: usuarioId,
                revokedAt: null,
                expiresAt: {
                    [db.Sequelize.Op.gt]: now
                }
            },
        });
    }

    // Revocar un token //
    async revoke(tokenHash){
        const token = await this.findByToken(tokenHash);
        if (!token) return null;

        token.revoked_at = new Date();
        await token.save();
        return token;
    }


    // Limpiar los tokens expirados //
    async deleteExpiredTokens(){
        const now = new Date();
        return await RefreshToken.destroy({
            where: {
                expires_at: {
                    [db.Sequelize.Op.lt]: now
                }
            },
        });
    }
}

export const refreshTokenRepository = new RefreshTokenRepository();