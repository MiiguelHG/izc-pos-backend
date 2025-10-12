import BaseRepository from "./baseRepository.js";
import db from "../models/index.js";

const Evento = db.evento;

class EventoRepository extends BaseRepository {
    constructor() {
        super(Evento);
    }

    async findByName(nombre){
        return await this.model.findOne({ where: { nombre } });
    }

    async findById(id){
        return await this.model.findByPk(id);
    }

    async findAllEventos(){
        return await this.model.findAll();
    }

    async createEvent(data){
        return await this.model.create(data);
    }

    async updateEvent(id, data){
        const evento = await this.findById(id);
        if(!evento) throw new Error("Evento no encontrado");
        return await evento.update(data);
    }

    async deleteEvent(id){
        const evento = await this.findById(id);
        if(!evento) throw new Error("Evento no encontrado");
        return await evento.destroy();
    }

}
export default EventoRepository;