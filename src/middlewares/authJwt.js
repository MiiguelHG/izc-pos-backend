import jwt from "jsonwebtoken";
import db from "../models/index.js";
import { sendError } from "../utils/responseFormater.js";
import { usuarioRepository } from "../repositories/usuarioRepository.js";


const { usuario: Usuario, rol: Rol } = db;

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
      if (jwtError.name === 'TokenExiredError') {
        return sendError(res, 401, "Unauthorized! Access Token was expired!");
      } else if (jwtError.name === 'JsonWebTokenError') {
        return sendError(res, 401, "Unauthorized! Invalid Access Token!");
      } else {
        return sendError(res, 500, `Unable to verify token: ${jwtError.message}`);
      }
    }
  };

  static async isAdmin(req, res, next) {
    try {
      const user = await usuarioRepository.findUserById(req.user.id);
      if (!user) return sendError(res, 404, "User not found");

      if (user.rol?.name !== "admin") {
        return sendError(res, 403, "Require Admin Role!");
      }

      next();
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  };

  static async isModerator(req, res, next){
    try{
      const user = await Usuario.findByPk(req.user.id, {
        include: [{ model: Rol, as: "rol" }],
      });
      if (!user) return sendError(res, 404, "User not found");

      if (user.rol?.name === "moderator") {
        next();
        return;
      }

      sendError(res, 403, "Require Moderator Role!");
    } catch (error) {
      sendError(res, 500, error.message);
    }
  };

  static async isModeratorOrAdmin(req, res, next) {
    try {
      const user = await Usuario.findByPk(req.user.id, {
        include: [{ model: Rol, as: "rol" }],
      });
      if (!user) return sendError(res, 404, "User not found");

      if (["admin", "moderator"].includes(user.rol?.name)) {
        next();
        return;
      }

      sendError(res, 403, "Require Moderator or Admin Role!");
    } catch (error) {
      sendError(res, 500, error.message);
    }
  };

}



