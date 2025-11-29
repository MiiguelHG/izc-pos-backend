import { usuarioRepository, refreshTokenRepository} from "../repositories/index.js";
import { generateAccessToken, generateRefreshToken, getExpirationFromToken } from "../utils/tokenUtils.js";
import { sendSuccess, sendError } from "../utils/responseFormater.js";

export class AuthController {
    static async register(req, res) {
        try{
            const { nombre, email, password, rolId , museoId} = req.body;

            const user = await usuarioRepository.create({ nombre, email, password, rolId, museoId });
            
            return sendSuccess(res, 201, "User registered successfully!", {user});
        }catch(error){
            return sendError(res, 500, `Error registering user: ${error.message}`);
        }
    }

    static async login(req, res){
        try{
            const { email, password } = req.body;

            const user = await usuarioRepository.findByAttribute("email", email);
            
            if(!user){
                return sendError(res, 404, "User Not found.");
            }

            const isPasswordValid = await user.validatePassword(password);

            if(!isPasswordValid){
                return sendError(res, 401, "Invalid Password!");
            }

            //Quitar password del objeto user antes de enviar la respuesta
            const newUser = {...user.dataValues};
            delete newUser.password;

            //Tokens
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            const expirationRefreshToken = getExpirationFromToken(refreshToken);

            // Guardar el refresh token en la base de datos //
            const newRefreshToken = await refreshTokenRepository.create({ token: refreshToken, usuarioId: user.id, expiresAt: expirationRefreshToken });

            // Enviar refresh token como cookie HTTP-only
            res.cookie('refreshToken', newRefreshToken.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // solo HTTPS en producción
                sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
                // domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : 'localhost',
                maxAge: expirationRefreshToken - new Date(),
                path: '/'
            });

            return sendSuccess(res, 200, "Login successful!", {
                user: newUser,
                accessToken
            });
        } catch(error) {
            return sendError(res, 500, `Error logging in: ${error.message}`);
        }
    }

    static async refreshToken(req, res) {
        try {
            // Leer refresh token desde la cookie
            const refreshToken = req.cookies.refreshToken;
            const { user } = req;

            if (!refreshToken) {
                return sendError(res, 400, "Refresh token required!");
            }

            // Rotacion de refresh token
            const newRefreshToken = generateRefreshToken(user);
            const expirationRefreshToken = getExpirationFromToken(newRefreshToken);
            
            const isRefreshTokenUpdated = await refreshTokenRepository.update({ token: refreshToken },
                { token: newRefreshToken, expiresAt: expirationRefreshToken }
            );

            if (!isRefreshTokenUpdated) {
                return sendError(res, 403, "Invalid refresh token!");
            }

            // Enviar nuevo refresh token como cookie
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
                // domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : 'localhost',
                maxAge: expirationRefreshToken - new Date(),
                path: '/'
            });

            return sendSuccess(res, 200, "Token refreshed successfully!", {
                accessToken: generateAccessToken(user)
            });
        } catch (error) {
            return sendError(res, 500, `Error refreshing token: ${error.message}`);
        }
    }

    static async logout(req, res) {
        try {
            // Leer refresh token desde la cookie
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken){
                return sendError(res, 400, "Refresh token required!");
            }

            const isRefreshTokenDeleted = await refreshTokenRepository.delete({ token: refreshToken });

            if (!isRefreshTokenDeleted) {
                return sendError(res, 404, "Refresh token not found!");
            }
 
            // Eliminar la cookie
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
                // domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : 'localhost',
                path: '/'
            });

            return sendSuccess(res, 200, "Logged out successfully!");
        } catch (error) {
            return sendError(res, 500, `Error logging out: ${error.message}`);
        }
    }
}
