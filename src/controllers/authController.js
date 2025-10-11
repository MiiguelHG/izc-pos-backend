import db from "../models/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import authConfig from "../config/auth.config.js";

const { usuario: Usuario, rol: Rol, refresh_tokens: RefreshToken } = db;

export const signup = async (req, res) => {
  try {
    const { nombre, email, password, id_rol } = req.body;

    // Validar si ya existe
    const existing = await Usuario.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: "El correo ya está registrado." });

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await Usuario.create({
      nombre,
      email,
      password: hashedPassword,
      id_rol: id_rol || 1, // Rol por defecto (1 = user)
    });

    res.status(201).json({ message: "Usuario registrado correctamente.", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el registro.", error: error.message });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Usuario.findOne({
      where: { email },
      include: { model: Rol },
    });

    if (!user) return res.status(404).json({ message: "Usuario no encontrado." });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: "Contraseña incorrecta." });

    // Generar JWT (Access Token)
    const token = jwt.sign({ id: user.id }, authConfig.secret, { expiresIn: authConfig.jwtExpiration });

    // Generar refresh token (hash + registro en BD)
    const rawToken = crypto.randomBytes(64).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    const expiresAt = new Date(Date.now() + authConfig.refreshExpirationDays * 24 * 60 * 60 * 1000);

    await RefreshToken.create({
      token_hash: tokenHash,
      id_usuario: user.id,
      expires_at: expiresAt,
    });

    res.status(200).json({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol?.name,
      accessToken: token,
      refreshToken: rawToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el inicio de sesión.", error: error.message });
  }
};

//Endpoint para el refresh token

//Se extrae el refreshtoken del cuerpo la petición
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: "Se requiere un token de refresco." });

    //Hasheo del token
    const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    //Se busca en la tabla de refresh_token el registro cuyo token_hash coincida con el hash generado
    const storedToken = await RefreshToken.findOne({ where: { token_hash: tokenHash } });
    //Validaciones de seguridad
    //1-No existe o fue manipulado el token
    //2-El usuario cerro sesion o el token fue reemplazado
    //3-El token expiró
    if (!storedToken) return res.status(403).json({ message: "Token inválido." });
    if (storedToken.revoked_at) return res.status(403).json({ message: "Token revocado." });
    if (storedToken.expires_at < new Date()) return res.status(403).json({ message: "Token expirado." });
    
    //Busca el usuario con el token generado
    const user = await Usuario.findByPk(storedToken.id_usuario);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado." });

    // Se genera un nuevo JWT
    const newAccessToken = jwt.sign({ id: user.id }, authConfig.secret, { expiresIn: authConfig.jwtExpiration });
    //Devuelve el nuevo token de acceso al usuario
    res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) { //Manejo de errores
    console.error(error);
    res.status(500).json({ message: "Error al refrescar el token.", error: error.message });
  }
};

// Endpoint para cerrar sesión (revocar el refresh token)
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken)
      return res.status(400).json({ message: "Se requiere un token de refresco." });

    // Hashear el token recibido
    const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    // Buscar el token en la base de datos
    const storedToken = await RefreshToken.findOne({ where: { token_hash: tokenHash } });

    if (!storedToken)
      return res.status(403).json({ message: "Token inválido o no encontrado." });

    // Marcarlo como revocado
    storedToken.revoked_at = new Date();
    await storedToken.save();

    res.status(200).json({ message: "Sesión cerrada correctamente. Token revocado." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al cerrar sesión.", error: error.message });
  }
};
