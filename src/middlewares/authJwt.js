import { sendError } from "#utils/responseFormater.js";
import { getUserIdFromToken } from "#utils/tokenUtils.js";
import { usuarioRepository } from "../repositories/index.js";

export class authJwt {
  static async verifyToken(req, res, next){
    const token = req.headers["x-access-token"] || req.headers["authorization"];

    if (!token) {
      return sendError(res, 403, "No token provided!");
    }

    try {
      const cleanToken = token.split(" ")[1];
      const userId = getUserIdFromToken(cleanToken, process.env.JWT_SECRET);

      const user = await usuarioRepository.findUserById(userId);

      if (!user) {
          return sendError(res, 401, "Unauthorized!");
      }

      req.user = user; // ✅ Deja disponible req.user.id y req.user.rol

      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return sendError(res, 401, "Unauthorized! Access Token was expired!");
      } else if (jwtError.name === 'JsonWebTokenError') {
        return sendError(res, 401, "Unauthorized! Invalid Access Token!");
      } else {
        return sendError(res, 500, `Unable to verify token: ${jwtError.message}`);
      }
    }
  };

  static hasRole(rolesRequeridos = []) {
    return async (req, res, next) => {
      try{

          if (!req.user){
            return sendError(res, 401, "Unauthorized! User information missing!");
          }

          const role =
            req.user.rol?.nombre ||
            req.user.rol?.dataValues?.nombre ||
            req.user.dataValues?.rol?.dataValues?.nombre;

          const rolName = role.trim().toLowerCase();

          if(!rolesRequeridos.map(r => r.toLowerCase()).includes(rolName)){
              return sendError(res, 403, `Require one of these roles: ${rolesRequeridos.join(', ')}!`);
          }
          next();
      }
      catch(error){
          return sendError(res, 500, `Error verificando rol: ${error.message}`);
      }
    };
  }
}



