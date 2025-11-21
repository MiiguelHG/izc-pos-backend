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

    async findOrCreateRole(nombre) {
        return await this.model.findOrCreate({
            where: { nombre },
        })
    }
}

export const rolRepository = new RolRepository();