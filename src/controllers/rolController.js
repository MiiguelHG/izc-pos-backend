import RolRepository from "../repositories/rolRepository.js";

const rolRepository = new RolRepository();

export class RolController {
    static async getAllRoles(req, res) {
        try{
            const roles = await rolRepository.getAll();
            return res.json(roles);
        }catch(error){
            return res.status(500).json({ message: "Error al obtener roles." });
        }
    }

    static async getById(req, res) {
        try{
            const rol = await rolRepository.getById(req.params.id);
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
            const newRole = await rolRepository.create({ name, description });
            return res.status(201).json(newRole);
        }catch(error){
            return res.status(500).json({ message: "Error al crear rol." });
        }
    }

    static async updateRole(req, res) {
        try{
            const { name, description } = req.body;
            const role = await rolRepository.getById(req.params.id);
            if(!role)
                return res.status(404).json({ message: "Rol no encontrado." });
            const updatedRole = await rolRepository.update(req.params.id, { name, description });
            return res.json(updatedRole);
        }catch(error){
            return res.status(500).json({ message: "Error al actualizar rol." });
        }
    }

    static async deleteRole(req, res) {
        try{
            const role = await rolRepository.getById(req.params.id);
            if(!role)
                return res.status(404).json({ message: "Rol no encontrado." });
            await rolRepository.delete(req.params.id);
            return res.json({ message: "Rol eliminado correctamente." });
        }catch(error){
            return res.status(500).json({ message: "Error al eliminar rol." });
        }
    }
}