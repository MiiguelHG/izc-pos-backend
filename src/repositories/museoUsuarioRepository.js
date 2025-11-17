import db from "../models/index.js";
import BaseRepository from "./baseRepository.js";

const { museoHasUsuario } = db;

class MuseoUsuarioRepository extends BaseRepository {
    constructor() {
        super(museoHasUsuario);
    }

    async createUserMuseo({museosIds = [], usuarioId}) {
        const userMuseos = museosIds.map(museoId => ({
            museoId,
            usuarioId
        }));
        
        return await museoHasUsuario.bulkCreate(userMuseos);
    }

    async findMuseosByUser(user) {
        return await user.getMuseos();
    }
}

export const museoUsuarioRepository = new MuseoUsuarioRepository();