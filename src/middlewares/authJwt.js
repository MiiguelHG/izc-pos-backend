import jwt from "jsonwebtoken";
//import db from "../models/index.js";
import { sendError } from "../utils/responseFormater.js";
import { usuarioRepository } from "../repositories/usuarioRepository.js";

// const { usuario: Usuario, rol: Rol } = db;

export class authJwt {
  static async verifyToken(req, res, next){
    const token = req.headers["x-access-token"] || req.headers["authorization"];

    if (!token) {
      return sendError(res, 403, "No token provided!");
    }

    try {
      const cleanToken = token.split(" ")[1];
      const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);

      const user = await usuarioRepository.findUserById(decoded.id);

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

  static hasRole(rolRequerido){
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
          if(rolName !== rolRequerido.trim().toLowerCase()){
              return sendError(res, 403, `Require ${rolRequerido} Role!`);
          }
          next();
      }
      catch(error){
          return sendError(res, 500, `Error verificando rol: ${error.message}`);
      }
    };
  }
}



