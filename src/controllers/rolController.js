import rolRepository from "../repositories/rolRepository.js";
import { sendSuccess } from "../utils/responseFormater.js";
//import RolRepository from "../repositories/rolRepository.js";

//const rolRepository = new RolRepository();

export class RolController {
    static async getAllRoles(req, res) {
        try{
            const roles = await rolRepository.findAllRoles();
            sendSuccess(res, 200, "Roles retrieved successfully.", roles);
            // return res.json(roles);
        }catch(error){
            sendError(res, 500, "Error al obtener roles.");
        }
    }

    static async getById(req, res) {
        try{
            const rol = await rolRepository.findById(req.params.id);
            if(!rol)
                sendError(res, 404, "Rol not found.");
            sendSuccess(res, 200, "Rol retrieved successfully.", rol);
        }catch(error){
            sendError(res, 500, "Error al obtener rol por ID.");
        }
    }

    static async createRole(req, res) {
        try{
            const { name, description } = req.body;

            // const existing = await rolRepository.findByName(name);
            // if(existing){
            //     return res.status(400).json({ message: "Role name already exists." });
            // }
            const newRole = await rolRepository.createRole({ name, description });
            sendSuccess(res, 201, "Role created successfully.", newRole);
        }catch(error){
            sendError(res, 500, "Error al crear rol.");
        }
    }

    static async updateRole(req, res) {
        try{
            const { name, description } = req.body;
            const updated = await rolRepository.updateRole(req.params.id, name, description);

            if(!updated)
                sendError(res, 404, "Rol not found.");
            sendSuccess(res, 200, "Rol updated successfully.", updated);
        }catch(error){
            sendError(res, 500, "Error al actualizar rol.");
        }
    }

    static async deleteRole(req, res) {
        try{
           const deleted = await rolRepository.deleteRole(req.params.id);
           if(!deleted){
                sendError(res, 404, "Rol not found.");
                // return res.status(404).json({ message: "Rol not found." });
           }
           sendSuccess(res, 200, "Role deleted successfully.");
        }catch(error){
            sendError(res, 500, "Error al eliminar rol.");
        }
    }
}