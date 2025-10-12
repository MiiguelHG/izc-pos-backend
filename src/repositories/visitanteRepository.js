import BaseRepository from "./baseRepository.js";
import db from "../models/index.js";

const Visitante = db.visitante;

class VisitanteRepository extends BaseRepository {
    constructor() {
        super(Visitante);
    }

    async findByName(nombre){
        return await this.model.findOne({ where: { nombre } });
    }

    async findById(id){
        return await this.model.findByPk(id);
    }

    async findAllVisitantes(){
        return await this.model.findAll();
    }
     
    async findByEmail(email){
        return await this.model.findOne({ where: { email } });
    }

   
    async findGroupVisitors(){
        return await this.model.findAll({ where: { grupo: true } });
    }

    
    async findIndividualVisitors(){
        return await this.model.findAll({ where: { grupo: false } });
    }

    
    async findByCountry(pais){
        return await this.model.findAll({ where: { pais } });
    }

    
    async findByGender(genero){
        return await this.model.findAll({ where: { genero } });
    }

    async createVisitor(data){
        return await this.model.create(data);
    }

    async updateVisitor(id, data){
        const visitante = await this.findById(id);
        if(!visitante) throw new Error("Visitante no encontrado");
        return await visitante.update(data);
    }

    async deleteVisitor(id){
        const visitante = await this.findById(id);
        if(!visitante) throw new Error("Visitante no encontrado");
        return await visitante.destroy();
    }

}
export default VisitanteRepository;