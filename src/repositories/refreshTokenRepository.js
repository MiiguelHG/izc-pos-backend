import db from "../models/index.js";
const RefreshToken = db.refresh_tokens;

class RefreshTokenRepository {
    // Crear un nuevo refresh token //
    async create(tokenHash, userId, expires_at){
        return await RefreshToken.create({ 
            token_hash: tokenHash, 
            id_usuario: userId, 
            expires_at: expires_at, 
        });
    }

    // Buscar un token por su valor //
    async findByToken(tokenHash){
        return await RefreshToken.findOne({ 
            where: { token_hash: tokenHash }, 
        });
    }

    // Eliminar un token específico //
    async delete(tokenHash){
        return await RefreshToken.destroy({ 
            where: { token_hash: tokenHash }, 
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

    // Obtener todos los tokens de un usuario //
    async findActiveByUserId(id_usuario){
        const now = new Date();
        return await RefreshToken.findAll({
            where: { 
                id_usuario: id_usuario,
                revoked_at: null,
                expires_at: {
                    [db.Sequelize.Op.gt]: now
                }
            },
        });
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

const refreshTokenRepo = new RefreshTokenRepository();
export default refreshTokenRepo;