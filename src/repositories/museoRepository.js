import BaseRepository from "./baseRepository.js";
import db from "../models/index.js";

const { museo,  } = db;

class MuseoRepository extends BaseRepository {
    constructor(){
        super(museo);
    }

    async createMuseo({nombre, ubicacion, descripcion}){
        return await this.create({ nombre, ubicacion, descripcion });
    }
}

export const museoRepository = new MuseoRepository();