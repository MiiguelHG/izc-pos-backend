import db from "../models/index.js";
import bcrypt from "bcryptjs";
import BaseRepository from "./baseRepository.js";

class UsuarioRepository extends BaseRepository {
    constructor(){
        super(db.usuario);
    }

    async findByUsername(nombre){
        return await this.model.findOne({ where: { nombre }, 
            include: [{ model: db.rol, as: "rol" }] });
    }

    async findByEmail(email){
        return await this.model.findOne({ where: { email }, 
            include: [{ model: db.rol, as: "rol" }] });
    }

    async createUser({nombre, email, password, id_rol}){
        const hashed = bcrypt.hashSync(password, 10);
        return await this.model.create({ nombre, email, password: hashed, id_rol });
    }

    async validatePassword(user, password){
        return bcrypt.compareSync(password, user.password);
    }
}

const usuarioRepo = new UsuarioRepository();
export default usuarioRepo;



