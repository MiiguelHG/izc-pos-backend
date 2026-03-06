import { usuarioRepository, rolRepository } from "#repositories/index.js";
import { sendError, sendSuccess } from "#utils/responseFormater.js";

export class UsuarioController {
    // Obtener todos los usuarios (solo admin)
    static async getAll(req, res) {
        try {
            const limit = 10;
            const page = parseInt(req.query.page) || 1;
            const offset = (page - 1) * limit;
            const { user } = req;

            const museoId = user.rol.nombre !== 'admin' ? user.museoId : null;

            const { rows, count } = await usuarioRepository.findAllWithoutPassword({ limit, offset, museoId });

            if (count === 0) {
                    return sendError(res, 404, "No users found.");
            }

            const totalPages = Math.ceil(count / limit);

            return sendSuccess(res,200, "Users retrieved successfully.", {
                data: rows,
                meta: {
                    totalItems: count,
                    currentPage: page,
                    totalPages,
                    pageSize: limit
                }
            });
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
                return sendError(res, 404, "User not found.");
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
            const { nombre, email, password, rolId, museoId } = req.body;

            const { user } = req;

            const rol = await rolRepository.findById(rolId);

            if (!rol) {
                return sendError(res, 404, "Role not found.");
            }

            if (user.rol.nombre !== 'admin' && user.museo.id !== museoId) {
                return sendError(res, 403, "Solo los administradores pueden actualizar usuarios de otros museos");
            }

            if (user.rol.nombre !== 'admin' && rol.nombre !== 'operador') {
                return sendError(res, 403, "Solo los administradores pueden actualizar usuarios a roles distintos de operador.");
            }

            const updatedUser = await usuarioRepository.update({ id }, { nombre, email, password, rolId, museoId });

            if (!updatedUser) {
                return sendError(res, 404, "User not found or could not be updated.");
            }

            return sendSuccess(res, 200, "User updated successfully.", updatedUser);
        } catch (error) {
            return sendError(res,500, `Error updating user: ${error.message}`);
        }
    }

    static async toggleActivo(req, res) {
        try {
            const { id } = req.params;
            const { user } = req;

            const userToTogle = await usuarioRepository.findById(id);

            if (!userToTogle) {
                return sendError(res, 404, "User not found.");
            }

            if (user.rol.nombre !== 'admin' && user.museo.id !== userToTogle.museoId) {
                return sendError(res, 403, "Solo los administradores pueden actualizar usuarios de otros museos");
            }

            const enabled = !userToTogle.activo;
            const updatedUser = await usuarioRepository.update({ id }, { activo: enabled });

            if (!updatedUser) {
                return sendError(res, 400, `No se pudo ${enabled ? 'habilitar' : 'deshabilitar'} el usuario.`);
            }

            return sendSuccess(res, 200, `Usuario ${enabled ? 'habilitado' : 'deshabilitado'} exitosamente.`, updatedUser);
        } catch (error) {
            return sendError(res, 500, `Error al actualizar el estado del usuario: ${error.message}`);
        }
    }
}