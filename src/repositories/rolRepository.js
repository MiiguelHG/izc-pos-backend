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

    async updateRole(id, name, description){
        const role = await this.update({id: id}, {name, description});
        return role;
    }

    async deleteRole(id){
        const role = await this.delete({id: id});
        return role;
    }
}

const rolRepository = new RolRepository();
export default rolRepository;
