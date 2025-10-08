import jwt from "jsonwebtoken";
import db from "../models/index.js";
import authconfig from "../config/auth.config.js";

const { user: Usuario, rol: Rol } = db;

export const verifyToken = (req, res, next) => {
    const token = req.headers["x-access-token"] || req.headers["authorization"];

    if (!token) {
        return res.status(403).json({ message: "No token provided!" });
    }

    try{
        const decoded = jwt.verify(token.replace("Bearer ", ""), authconfig.secret);
        req.userId = decoded.id;

        const user = Usuario.findByPk(req.userId);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized!" });
        }

        next();
    }catch(error){
        return res.status(401).json({ message: "Unauthorized!" });
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        const user = await Usuario.findByPk(req.userId);
        const roles = await user.getRoles();

        const adminRole = roles.find((rol) => rol.name === "admin");
        if (adminRole) {
            next();
            return;
        }
 
        res.status(403).json({ message: "Require Admin Role!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const isModerator = async (req, res, next) => {
    try {
        const user = await Usuario.findByPk(req.userId);
        const roles = await user.getRoles();

        const modRole = roles.find((rol) => rol.name === "moderator");
        if (modRole) {
            next();
            return;
        }
 
        res.status(403).json({ message: "Require Moderator Role!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
 
export const isModeratorOrAdmin = async (req, res, next) => {
    try {
        const user = await Usuario.findByPk(req.userId);
        const roles = await user.getRoles();

        const hasRole = roles.some((rol) => ["admin", "moderator"].includes(rol.name));
        if (hasRole) {
            next();
            return;
        }
 
        res.status(403).json({ message: "Require Moderator or Admin Role!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};