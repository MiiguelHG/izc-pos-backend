import jwt from "jsonwebtoken";
import db from "../models/index.js";
import { sendSuccess, sendError } from "../utils/responseFormater.js";


const { usuario: Usuario, rol: Rol } = db;

export default class authJwt {
  static async verifyToken(req, res, next){
    const token = req.headers["x-access-token"] || req.headers["authorization"];

    if (!token) {
      sendError(res, 403, "No token provided!");
      //return res.status(403).json({ message: "No token provided!" });
    }

    try {
      const cleanToken = token.replace("Bearer ", "");
      const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);

      const user = await Usuario.findByPk(decoded.id, {
        include: [{ model: Rol, as: "rol" }],
      });

      if (!user) {
        sendError(res, 401, "Unauthorized!");
        //return res.status(401).json({ message: "Unauthorized!" });
      }

      req.user = user; // ✅ Deja disponible req.user.id y req.user.rol
      next();
    } catch (error) {
      sendError(res, 401, "Unauthorized!");
      // console.error("Error verifying token:", error);
      // return res.status(401).json({ message: "Unauthorized!" });
    }
  };

  static async isAdmin(req, res, next) {
    try {
      const user = await Usuario.findByPk(req.user.id, {
        include: [{ model: Rol, as: "rol" }],
      });
      if (!user) sendError(res, 404, "User not found");

      if (user.rol?.name === "admin") {
        next();
        return;
      }

      // res.status(403).json({ message: "Require Admin Role!" });
      sendError(res, 403, "Require Admin Role!");
    } catch (error) {
      sendError(res, 500, error.message);
      // console.error(error);
      // res.status(500).json({ message: error.message });
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



