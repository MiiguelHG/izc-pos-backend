import { rolRepository } from "../repositories/index.js";
import { sendSuccess, sendError } from "../utils/responseFormater.js";
//import RolRepository from "../repositories/rolRepository.js";

//const rolRepository = new RolRepository();

export class RolController {
    static async getAllRoles(req, res) {
        try{
            const roles = await rolRepository.findAll();

            if(!roles || roles.length === 0){
                return sendError(res, 404, "No roles found.");
            }

            return sendSuccess(res, 200, "Roles retrieved successfully.", roles);
        }catch(error){
            return sendError(res, 500, `Error al obtener roles: ${error.message}`);
        }
    }

    static async getById(req, res) {
        try{
            const { id } = req.params;

            const rol = await rolRepository.findById(id);

            if(!rol){
                return sendError(res, 404, "Rol not found.");
            }

            return sendSuccess(res, 200, "Rol retrieved successfully.", rol);
        }catch(error){
            return sendError(res, 500, `Error al obtener rol por ID: ${error.message}`);
        }
    }

    static async createRole(req, res) {
        try{
            const { nombre } = req.body;
            const newRole = await rolRepository.create({ nombre });

            if(!newRole){
                return sendError(res, 400, "Error creating role.");
            }

            return sendSuccess(res, 201, "Role created successfully.", newRole);
        }catch(error){
            return sendError(res, 500, `Error al crear rol: ${error.message}`);
        }
    }

    static async updateRole(req, res) {
        try{
            const { id } = req.params;
            const { nombre } = req.body;

            const updated = await rolRepository.update({id: id}, {nombre});

            if(!updated)
                return sendError(res, 404, "Rol not found.");
            
            return sendSuccess(res, 200, "Rol updated successfully.", updated);
        }catch(error){
            return sendError(res, 500, `Error al actualizar rol: ${error.message}`);
        }
    }

    static async deleteRole(req, res) {
        try{
            const { id } = req.params;

           const deleted = await rolRepository.delete({id: id});
           
           if(!deleted){
                return sendError(res, 404, "Rol not found.");
                // return res.status(404).json({ message: "Rol not found." });
           }

           return sendSuccess(res, 200, "Role deleted successfully.");
        }catch(error){
            return sendError(res, 500, `Error al eliminar rol: ${error.message}`);
        }
    }
}