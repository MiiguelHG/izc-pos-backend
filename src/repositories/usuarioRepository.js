import db from "../models/index.js";
import BaseRepository from "./baseRepository.js";

const { usuario, rol, museo } = db;

class UsuarioRepository extends BaseRepository {
    constructor(){
        super(usuario);
    }

    async findAllWithoutPassword() {
        return await this.findAll({
            attributes: { exclude: ["password"] },
            include: [
                { model: rol, as: "rol" },
                { model: museo, as: "museo" }
            ]
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



