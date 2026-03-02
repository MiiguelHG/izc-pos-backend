import { Op } from "sequelize";
import db from "../models/index.js";
import BaseRepository from "./baseRepository.js";

const { usuario, rol, museo } = db;

class UsuarioRepository extends BaseRepository {
    constructor(){
        super(usuario);
    }

    async findAllWithoutPassword({limit = 10, offset = 0, museoId}) {
        const whereClause = museoId ? { museoId } : {};
        const rolInclude = museoId
            ? { model: rol, as: "rol", where: { nombre: { [Op.ne]: "admin" } }, required: true }
            : { model: rol, as: "rol" };
        return await this.model.findAndCountAll({
            where: whereClause,
            attributes: { exclude: ["password"] },
            include: [
                rolInclude,
                { model: museo, as: "museo" }
            ],
            limit,
            offset
        })
    }

    async findUserById(id){
        return await this.findById(id, {
            include: [
                { model: rol, as: "rol" },
                { model: museo, as: "museo" }
            ],
            attributes: { exclude: ["password"] },
        });
    }

    async findByAttribute(attribute, value){
        return await this.model.findOne({ 
            where: { [attribute]: value }, 
            include: [
                { model: rol, as: "rol" },
                { model: museo, as: "museo" }
            ]
        });
    }
}

export const usuarioRepository = new UsuarioRepository();



