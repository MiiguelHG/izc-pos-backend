import { usuarioRepository, refreshTokenRepository, museoRepository, museoUsuarioRepository } from "../repositories/index.js";
import { generateAccessToken, generateRefreshToken } from "../utils/tokenUtils.js";
import { sendSuccess, sendError } from "../utils/responseFormater.js";

export class AuthController {
    static async register(req, res) {
        try{
            const { nombre, email, password, rolId , museosIds} = req.body;

            const user = await usuarioRepository.createUser({ nombre, email, password, rolId });

            if (!user) {
                return sendError(res, 400, "Error creating user.");
            }

            const userMuseos = await museoUsuarioRepository.createUserMuseo({museosIds, usuarioId: user.id});

            if (!userMuseos) {
                return sendError(res, 400, "Error associating museums to user.");
            }
            
            const museosUser = await museoUsuarioRepository.findMuseosByUser(user);
            
            return sendSuccess(res, 201, "User registered successfully!", {
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                rolId: user.rolId,
                museos: museosUser
            });
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

            //Tokens
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            const museosUsuario = await museoUsuarioRepository.findMuseosByUser(user);

            return sendSuccess(res, 200, "Login successful!", {
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                rolId: user.rolId,
                museos: museosUsuario,
                accessToken,
                refreshToken
            });
        } catch(error) {
            return sendError(res, 500, `Error logging in: ${error.message}`);
        }
    }

    static async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;
            const { user } = req;

            if (!refreshToken) {
                return sendError(res, 400, "Refresh token required!");
            }

            // Rotacion de refresh token
            const newRefreshToken = generateRefreshToken(user);
            const isRefreshTokenUpdated = await refreshTokenRepository.updateRefreshToken(refreshToken, newRefreshToken, new Date(Date.now() + 7*24*60*60*1000));

            if (!isRefreshTokenUpdated) {
                return sendError(res, 403, "Invalid refresh token!");
            }

            return sendSuccess(res, 200, "Token refreshed successfully!", {
                accessToken: generateAccessToken(user),
                refreshToken: newRefreshToken
            });
        } catch (error) {
            return sendError(res, 500, `Error refreshing token: ${error.message}`);
        }
    }

    static async logout(req, res) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken){
                return sendError(res, 400, "Refresh token required!");
            }

            const isRefreshTokenDeleted = await refreshTokenRepository.delete({ token: refreshToken });

            if (!isRefreshTokenDeleted) {
                return sendError(res, 404, "Refresh token not found!");
            }

            return sendSuccess(res, 200, "Logged out successfully!");
        } catch (error) {
            return sendError(res, 500, `Error logging out: ${error.message}`);
        }
    }
}
