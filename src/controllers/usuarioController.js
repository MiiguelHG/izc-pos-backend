import { usuarioRepository } from "#repositories/index.js";
import { sendError, sendSuccess } from "#utils/responseFormater.js";

export class UsuarioController {
    // Obtener todos los usuarios (solo admin)
    static async getAll(req, res) {
        try {
            const users = await usuarioRepository.findAllWithoutPassword();

            if (!users || users.length === 0){
                    return sendError(res, "No users found.", 404);
            }

            return sendSuccess(res,200, "Users retrieved successfully.", users);
        } catch (error) {
            sendError(res,500, `Error retrieving users: ${error.message}`);
        }
    }

    // Obtener un usuario por ID (solo admin o el mismo usuario)
    static async getById(req, res) {
        try {
            const { id } = req.params;

            const user = await usuarioRepository.findUserById(id);

            if (!user) {
                return sendError(res, "User not found.", 404);
            }

            return sendSuccess(res, 200, "User retrieved successfully.", user);
        } catch (error) {
            sendError(res,500, `Error retrieving user: ${error.message}`);
        }
    }

    // Actualizar un usuario (solo admin o el mismo usuario)
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { nombre, email, password, activo, rolId } = req.body;

            const updatedUser = await usuarioRepository.update({ id }, { nombre, email, password, activo, rolId });

            if (!updatedUser) {
                return sendError(res, "User not found or could not be updated.", 404);
            }

            return sendSuccess(res, 200, "User updated successfully.", updatedUser);
        } catch (error) {
            return sendError(res,500, `Error updating user: ${error.message}`);
        }
    }

    // Eliminar un usuario (solo admin)
    static async delete(req, res) {
        try {
            const { id } = req.params;

            const deleted = await usuarioRepository.delete({ id });

            if (!deleted) {
                return sendError(res, "User not found or could not be deleted.", 404);
            }

            return sendSuccess(res, 200, "User deleted successfully.");
        } catch (error) {
            return sendError(res,500, `Error deleting user: ${error.message}`);
        }
    }
}