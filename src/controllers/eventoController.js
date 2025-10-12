import EventoRepository from "../repositories/eventoRepository.js";

const eventoRepository = new EventoRepository();

export class EventoController {
    static async getAllEventos(req, res) {
        try {
            const eventos = await eventoRepository.findAllEventos();
            return res.json(eventos);
        } catch(error) {
            return res.status(500).json({ message: "Error al obtener eventos." });
        }
    }

    static async getById(req, res) {
        try {
            const evento = await eventoRepository.findById(req.params.id);
            if(!evento)
                return res.status(404).json({ message: "Evento no encontrado." });
            return res.json(evento);
        } catch(error) {
            return res.status(500).json({ message: "Error al obtener evento por ID." });
        }
    }

    static async createEvent(req, res) {
        try {
            const { nombre, fecha_inicio, fecha_fin, lugar, capacidad, precio } = req.body;

            // Validar campos requeridos
            if(!nombre || !fecha_inicio || !fecha_fin || !lugar || !capacidad || !precio) {
                return res.status(400).json({ message: "Todos los campos son obligatorios." });
            }

            // Validar que fecha_fin sea posterior a fecha_inicio
            if(new Date(fecha_fin) <= new Date(fecha_inicio)) {
                return res.status(400).json({ message: "La fecha de fin debe ser posterior a la fecha de inicio." });
            }

            // Validar que capacidad y precio sean positivos
            if(capacidad <= 0 || precio < 0) {
                return res.status(400).json({ message: "Capacidad y precio deben ser valores positivos." });
            }

            // Validar si ya existe un evento con ese nombre
            const existing = await eventoRepository.findByName(nombre);
            if(existing) {
                return res.status(400).json({ message: "Ya existe un evento con ese nombre." });
            }

            const newEvent = await eventoRepository.createEvent({ 
                nombre, 
                fecha_inicio, 
                fecha_fin, 
                lugar, 
                capacidad, 
                precio 
            });
            return res.status(201).json(newEvent);
        } catch(error) {
            return res.status(500).json({ message: "Error al crear evento." });
        }
    }

    static async updateEvent(req, res) {
        try {
            const { nombre, fecha_inicio, fecha_fin, lugar, capacidad, precio } = req.body;
            const evento = await eventoRepository.findById(req.params.id);
            if(!evento)
                return res.status(404).json({ message: "Evento no encontrado." });

            // Validar fechas si se proporcionan
            if(fecha_inicio && fecha_fin) {
                if(new Date(fecha_fin) <= new Date(fecha_inicio)) {
                    return res.status(400).json({ message: "La fecha de fin debe ser posterior a la fecha de inicio." });
                }
            }

            // Validar valores positivos si se proporcionan
            if(capacidad !== undefined && capacidad <= 0) {
                return res.status(400).json({ message: "La capacidad debe ser un valor positivo." });
            }
            if(precio !== undefined && precio < 0) {
                return res.status(400).json({ message: "El precio debe ser un valor positivo." });
            }
            
            const updatedEvent = await eventoRepository.updateEvent(req.params.id, { 
                nombre, 
                fecha_inicio, 
                fecha_fin, 
                lugar, 
                capacidad, 
                precio 
            });
            return res.json(updatedEvent);
        } catch(error) {
            return res.status(500).json({ message: "Error al actualizar evento." });
        }
    }

    static async deleteEvent(req, res) {
        try {
            const evento = await eventoRepository.findById(req.params.id);
            if(!evento)
                return res.status(404).json({ message: "Evento no encontrado." });
            
            await eventoRepository.deleteEvent(req.params.id);
            return res.json({ message: "Evento eliminado correctamente." });
        } catch(error) {
            return res.status(500).json({ message: "Error al eliminar evento." });
        }
    }
}