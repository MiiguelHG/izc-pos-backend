import BaseRepository from "./baseRepository.js";
import db from "../models/index.js";

const { museo,  } = db;

class MuseoRepository extends BaseRepository {
    constructor(){
        super(museo);
    }
}

export const museoRepository = new MuseoRepository();