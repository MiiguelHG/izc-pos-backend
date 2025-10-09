import jwt from "jsonwebtoken";
import UsuarioRepository from "../repositories/usuarioRepository.js";

const usuarioRepo = new UsuarioRepository();

export class AuthController {
    static async register(req, res) {
        try{
            const { nombre, email, password, rolId } = req.body;

            const existing = await usuarioRepo.findByEmail(email);
            if(existing)
                return res.status(400).json({ message: "Email is already in use!" });

            const user = await usuarioRepo.createUser({ nombre, email, password, rolId });

            res.status(201).json({
                message: "User registered successfully!",
                user: {
                    id: user.id,
                    nombre: user.nombre,
                    email: user.email,
                },
            });
        }catch(error){
            res.status(500).json({ message: error.message });
        }
    }

    static async login(req, res){
        try{
            const { email, password } = req.body;

            const user = await usuarioRepo.findByEmail(email);
            if(!user)
                return res.status(404).json({ message: "User Not found." });

            const passwordIsValid = await usuarioRepo.validatePassword(user, password);
            if(!passwordIsValid)
                return res.status(401).json({
                    accessToken: null,
                    message: "Invalid Password!",
                });

            //Tokens
            const accesToken = jwt.sign(
                { id: user.id, rol: user.rolId },
                process.env.JWT_SECRET,
                { expiresIn: "15m" } // 15 minutes
            );

            const refreshToken = jwt.sign(
                { id: user.id },
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: "7d" } // 7 days
            );

            res.json({
                message: "Login successful!",
                accesToken,
                refreshToken,
                user: {
                    id: user.id,
                    nombre: user.nombre,
                    email: user.email,
                    rolId: user.rolId,
                },
            });
        }catch(error){
            res.status(500).json({ message: error.message });
        }
    }
}