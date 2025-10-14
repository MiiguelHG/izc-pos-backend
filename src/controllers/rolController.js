import RolRepository from "../repositories/rolRepository.js";
import { sendSuccess, sendError } from "../utils/responseFormater.js";

const rolRepository = new RolRepository();

export class RolController {
    static async getAllRoles(req, res) {
        try{
            const roles = await rolRepository.findAllRoles();
            return res.json(roles);
        }catch(error){
            return res.status(500).json({ message: "Error al obtener roles." });
        }
    }

    static async getById(req, res) {
        try{
            const rol = await rolRepository.findById(req.params.id);
            if(!rol)
                return res.status(404).json({ message: "Rol no encontrado." });
            return res.json(rol);
        }catch(error){
            return res.status(500).json({ message: "Error al obtener rol por ID." });
        }
    }

    static async createRole(req, res) {
        try{
            const { name, description } = req.body;

            const existing = await rolRepository.findByName(name);
            if(existing){
                return res.status(400).json({ message: "El tipo de Rol ya existe." });
            }
            const newRole = await rolRepository.createRole({ name, description });
            return res.status(201).json(newRole);
        }catch(error){
            return res.status(500).json({ message: "Error al crear rol." });
        }
    }

    static async updateRole(req, res) {
        try{
            // Antes
            // const { name, description } = req.body;
            // const role = await rolRepository.findById(req.params.id);

            // if(!role)
            //     return res.status(404).json({ message: "Rol not found." });

            // const updatedRole = await rolRepository.updateRole(req.params.id, { name, description });
            // return res.json(updatedRole);

            // Después
            const { name, description } = req.body;
            const updated = await rolRepository.updateRole(req.params.id, name, description);

            if(!updated){
                return sendError(res, 404, "Rol not found.");
            }
            return sendSuccess(res, 200, "Rol updated successfully.");

        }catch(error){
            return res.status(500).json({ message: "Error al actualizar rol." });
        }
    }

    static async deleteRole(req, res) {
        try{
            const deleted = await rolRepository.deleteRole(req.params.id);
            if(!deleted){
                return sendError(res, 404, "Rol not found.");
            }
            return sendSuccess(res, 200, "Rol deleted successfully.");
        }catch(error){
            return res.status(500).json({ message: "Error al eliminar rol." });
        }
    }
}