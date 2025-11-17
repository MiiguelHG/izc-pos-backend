import BaseRepository from "./baseRepository.js";
import db from "../models/index.js";

const { rol } = db;

class RolRepository extends BaseRepository {
    constructor() {
        super(rol);
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
        return await this.create(data);
    }

    async findOrCreateRole(nombre) {
        return await this.model.findOrCreate({
            where: { nombre },
        })
    }

    async updateRole(id, name, description){
        const role = await this.update({id: id}, {name, description});
        return role;
    }

    async deleteRole(id){
        const role = await this.delete({id: id});
        return role;
    }
}

export const rolRepository = new RolRepository();