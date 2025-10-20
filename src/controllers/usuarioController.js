// import UsuarioRepository from "../repositories/usuarioRepository.js";
// const usuarioRepo = new UsuarioRepository();
import usuarioRepo from "../repositories/usuarioRepository.js";

export class UsuarioController {
    // Obtener todos los usuarios (solo admin)
    static async getAll(req, res) {
        try {
            const users = await usuarioRepo.findAll({
                include: ["rol"],
                attributes: { exclude: ["password"] }
            });
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Obtener un usuario por ID (solo admin o el mismo usuario)
    static async getById(req, res) {
        try {
            const { id } = req.params;

            // // Solo admin o el propio usuario puede acceder
            // if (req.user.rol.name !== "admin" && req.user.id !== parseInt(id))
            //     return res.status(403).json({ message: "Access denied." });

            const user = await usuarioRepo.findById(id, {
                include: ["rol"],
                attributes: { exclude: ["password"] }
            });

            if (!user)
                return res.status(404).json({ message: "User not found." });

            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Perfil del usuario autenticado
    static async getProfile(req, res) {
        try {
            const user = await usuarioRepo.findById(req.user.id, {
                include: ["rol"],
                attributes: { exclude: ["password"] }
            });

            if (!user)
                return res.status(404).json({ message: "User not found." });

            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Actualizar un usuario (solo admin o el mismo usuario)
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { nombre, email, password, activo, rolId } = req.body;

            // if (req.user.rol.name !== "admin" && req.user.id !== parseInt(id))
            //     return res.status(403).json({ message: "Access denied." });

            const data = { nombre, email, rolId };
            if (password) data.password = password;
            if (req.user.rol.name === "admin" && activo !== undefined)
                data.activo = activo;

            const updated = await usuarioRepo.update(id, data);
            res.json({ message: "User updated successfully!", updated });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Eliminar un usuario (solo admin)
    static async delete(req, res) {
        try {
            const { id } = req.params;

            // if (req.user.rol.name !== "admin")
            //     return res.status(403).json({ message: "Access denied." });

            await usuarioRepo.delete(id);
            res.json({ message: "User deleted successfully!" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
