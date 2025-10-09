import db from "../models/index.js";
import bcrypt from "bcryptjs";
import BaseRepository from "./baseRepository.js";

export default class UsuarioRepository extends BaseRepository {
    constructor(){
        super(db.usuario);
    }

    async findByUsername(nombre){
        return await this.model.findOne({ where: { nombre }, include: db.rol, });
    }

    async findByEmail(email){
        return await this.model.findOne({ where: { email }, include: db.rol, });
    }

    async createUser({nombre, email, password, rolId}){
        const hashed = bcrypt.hashSync(password, 10);
        return await this.model.create({ nombre, email, password: hashed, rolId });
    }

    async validatePassword(user, password){
        return bcrypt.compareSync(password, user.password);
    }
}



