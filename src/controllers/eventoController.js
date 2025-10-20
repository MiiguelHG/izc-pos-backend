//import EventoRepository from "../repositories/eventoRepository.js";
import eventoRepository from "../repositories/eventoRepository.js";
import { sendSuccess } from "../utils/responseFormater.js";


//const eventoRepository = new EventoRepository();

export class EventoController {
    static async getAllEventos(req, res) {
        try {
            const eventos = await eventoRepository.findAllEventos();
            return sendSuccess(res, 200, "Eventos obtenidos correctamente.", eventos);
        } catch(error) {
            return sendError(res, 500, "Error al obtener eventos.");
        }
    }

    static async getById(req, res) {
        try {
            const evento = await eventoRepository.findById(req.params.id);
            if(!evento)
                return sendError(res, 404, "Evento no encontrado.");
            return sendSuccess(res, 200, "Evento obtenido correctamente.", evento);
        } catch(error) {
            return sendError(res, 500, "Error al obtener evento por ID.");
        }
    }

    static async createEvent(req, res) {
        try {
            const { nombre, fecha_inicio, fecha_fin, lugar, capacidad, precio } = req.body;

            // Validar campos requeridos
            if(!nombre || !fecha_inicio || !fecha_fin || !lugar || !capacidad || !precio) {
                return sendError(res, 400, "Todos los campos son obligatorios.");
            }

            // Validar que fecha_fin sea posterior a fecha_inicio
            if(new Date(fecha_fin) <= new Date(fecha_inicio)) {
                return sendError(res, 400, "La fecha de fin debe ser posterior a la fecha de inicio.");
            }

            // Validar que capacidad y precio sean positivos
            if(capacidad <= 0 || precio < 0) {
                return sendError(res, 400, "Capacidad y precio deben ser valores positivos.");
            }

            // Validar si ya existe un evento con ese nombre
            const existing = await eventoRepository.findByName(nombre);
            if(existing) {
                return sendError(res, 400, "Ya existe un evento con ese nombre.");
            }

            const newEvent = await eventoRepository.createEvent({ 
                nombre, 
                fecha_inicio, 
                fecha_fin, 
                lugar, 
                capacidad, 
                precio 
            });
            return sendSuccess(res, 201, "Evento creado correctamente.", newEvent);
        } catch(error) {
            return sendError(res, 500, "Error al crear evento.");
        }
    }

    static async updateEvent(req, res) {
        try {
            const { nombre, fecha_inicio, fecha_fin, lugar, capacidad, precio } = req.body;
            const evento = await eventoRepository.findById(req.params.id);
            if(!evento)
                return sendError(res, 404, "Evento no encontrado.");

            // Validar fechas si se proporcionan
            if(fecha_inicio && fecha_fin) {
                if(new Date(fecha_fin) <= new Date(fecha_inicio)) {
                    return sendError(res, 400, "La fecha de fin debe ser posterior a la fecha de inicio.");
                }
            }

            // Validar valores positivos si se proporcionan
            if(capacidad !== undefined && capacidad <= 0) {
                return sendError(res, 400, "La capacidad debe ser un valor positivo.");
            }
            if(precio !== undefined && precio < 0) {
                return sendError(res, 400, "El precio debe ser un valor positivo.");
            }
            
            const updatedEvent = await eventoRepository.updateEvent(req.params.id, { 
                nombre, 
                fecha_inicio, 
                fecha_fin, 
                lugar, 
                capacidad, 
                precio 
            });
            return sendSuccess(res, 200, "Evento actualizado correctamente.", updatedEvent);
        } catch(error) {
            return sendError(res, 500, "Error al actualizar evento.");
        }
    }

    static async deleteEvent(req, res) {
        try {
            const evento = await eventoRepository.findById(req.params.id);
            if(!evento)
                return sendError(res, 404, "Evento no encontrado.");
            
            await eventoRepository.deleteEvent(req.params.id);
            return sendSuccess(res, 200, "Evento eliminado correctamente.");
        } catch(error) {
            return sendError(res, 500, "Error al eliminar evento.");
        }
    }
}