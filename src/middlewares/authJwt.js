import jwt from "jsonwebtoken";
import db from "../models/index.js";
import authconfig from "../config/auth.config.js";

const { usuario: Usuario, rol: Rol } = db;

// ======================
// Verificar el token JWT
// ======================
export const verifyToken = async (req, res, next) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "No token provided!" });
  }

  try {
    const cleanToken = token.replace("Bearer ", "");
    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);

    const user = await Usuario.findByPk(decoded.id, {
      include: [{ model: Rol, as: "rol" }],
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized!" });
    }

    req.user = user; // ✅ Deja disponible req.user.id y req.user.rol
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Unauthorized!" });
  }
};

// ======================
// Verificar si es Admin
// ======================
export const isAdmin = async (req, res, next) => {
  try {
    const user = await Usuario.findByPk(req.user.id, {
      include: [{ model: Rol, as: "rol" }],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.rol?.name === "admin") {
      next();
      return;
    }

    res.status(403).json({ message: "Require Admin Role!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// Verificar si es Moderator
// ==========================
export const isModerator = async (req, res, next) => {
  try {
    const user = await Usuario.findByPk(req.userId, {
      include: [{ model: Rol, as: "rol" }],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.rol?.name === "moderator") {
      next();
      return;
    }

    res.status(403).json({ message: "Require Moderator Role!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ===================================
// Verificar si es Moderator o Admin
// ===================================
export const isModeratorOrAdmin = async (req, res, next) => {
  try {
    const user = await Usuario.findByPk(req.userId, {
      include: [{ model: Rol, as: "rol" }],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (["admin", "moderator"].includes(user.rol?.name)) {
      next();
      return;
    }

    res.status(403).json({ message: "Require Moderator or Admin Role!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
