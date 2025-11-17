import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

export const generateAccessToken = (user) => {
    const nonce = crypto.randomBytes(16).toString("hex");
    return jwt.sign({
        id: user.id,
        rol: user.rolId,
        nonce: nonce
    }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (user) => {
    const nonce = crypto.randomBytes(16).toString("hex");
    return jwt.sign({
        id: user.id,
        nonce: nonce
    }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};