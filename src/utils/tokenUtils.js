import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

export const generateAccessToken = (user) => {
    const nonce = crypto.randomBytes(16).toString("hex");
    return jwt.sign({
        id: user.id,
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

export const getExpirationFromToken = (token) => {
    const decoded = jwt.decode(token);
    return decoded && decoded.exp ? new Date(decoded.exp * 1000) : null;
}

export const getUserIdFromToken = (token, secret) => {
    const decoded = jwt.verify(token, secret);
    return decoded && decoded.id ? decoded.id : null;
}