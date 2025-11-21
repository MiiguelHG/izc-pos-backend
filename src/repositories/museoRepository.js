import BaseRepository from "./baseRepository.js";
import db from "../models/index.js";

const { museo,  } = db;

class MuseoRepository extends BaseRepository {
    constructor(){
        super(museo);
    }

    async createMuseo({nombre, ubicacion}){
        return await this.create({ nombre, ubicacion});
    }
}

export const museoRepository = new MuseoRepository();