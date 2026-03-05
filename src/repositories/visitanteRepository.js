import BaseRepository from "./baseRepository.js";
import db from "../models/index.js";
import { Op, or } from "sequelize";


const { visitante } = db;

class VisitanteRepository extends BaseRepository {
    constructor() {
        super(visitante);
    }

    async findAllVisitantes({limit = 10, offset = 0}) {
        return await this.model.findAndCountAll({limit, offset});
    }

    async findAllVisitantesByMuseoId({museoId, limit = 10, offset = 0}) {
        return await this.model.findAndCountAll({
            where: { museoId },
            limit,
            offset
        });
    }

}
export const visitanteRepository = new VisitanteRepository();