import BaseRepository from "./baseRepository.js";
import db from "../models/index.js";

const Rol = db.rol;

class RolRepository extends BaseRepository {
    constructor() {
        super(Rol);
    }

    async findByName(name){
        return await this.model.findOne({ where: { name } });
    }

    async findById(id){
        return await this.model.findByPk(id);
    }

    async findAllRoles(){
        return await this.model.findAll();
    }

    async createRole(data){
        return await this.model.create(data);
    }

    async updateRole(id, data){
        const role = await this.findById(id);
        if(!role) throw new Error("Role not found");
        return await role.update(data);
    }

    async deleteRole(id){
        const role = await this.findById(id);
        if(!role) throw new Error("Role not found");
        return await role.destroy();
    }
}

export default RolRepository;
