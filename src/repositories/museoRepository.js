import BaseRepository from "./baseRepository.js";
import db from "../models/index.js";

const { museo,  } = db;

class MuseoRepository extends BaseRepository {
    constructor(){
        super(museo);
    }

    async findAndCountAll({limit = 10, offset = 0}) {
        return await this.model.findAndCountAll({
            limit,
            offset
        });
    }
}

export const museoRepository = new MuseoRepository();