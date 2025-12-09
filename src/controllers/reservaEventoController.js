import { reservaEventoRepository } from "#repositories/index.js";
import { ReservaEventoService } from "../services/reservaEventoService.js";
import { sendSuccess, sendError } from "#utils/responseFormater.js";

export class ReservaEventoController {
    static async createReservaEvento(req, res) {
        try {
            const newReserva =  await ReservaEventoService.crearReserva(req.body);
            const reserva = await reservaEventoRepository.create(newReserva);
            if (!newReserva) {
                return sendError(res, 400, "No se pudo crear la reserva de evento.");
            }
            return sendSuccess(res, 201, "Reserva de evento creada exitosamente.", reserva);
        } catch (error) {
            return sendError(res, 500, `Error al crear reserva de evento: ${error.message}`);
        }
    }

    static async getReservasEvento(req, res) {
        try {
            const reservas = await reservaEventoRepository.findAll();
            if (!reservas) {
                return sendError(res, 404, "No se encontraron reservas de eventos.");
            }
            return sendSuccess(res, 200, "Reservas de eventos recuperadas exitosamente.", reservas);
        } catch (error) {
            return sendError(res, 500, `Error al obtener reservas de eventos: ${error.message}`);
        }
    }

    static async getReservaEventoById(req, res) {
        try {
            const reserva = await reservaEventoRepository.findById(req.params.id);
            if (!reserva) {
                return sendError(res, 404, "Reserva de evento no encontrada.");
            }
            return sendSuccess(res, 200, "Reserva de evento recuperada exitosamente.", reserva);
        } catch (error) {
            return sendError(res, 500, `Error al obtener reserva de evento por ID: ${error.message}`);
        }
    }

    static async updateReservaEvento(req, res){
        try{
            const { id } = req.params
            const updatedReserva = await ReservaEventoService.actualizarReserva(id, req.body);

            if (!updatedReserva) {
                return sendError(res, 404, "Reserva de evento no encontrada o no se pudo actualizar.");
            }
            return sendSuccess(res, 200, "Reserva de evento actualizada exitosamente.", updatedReserva);
        } catch (error) {
            return sendError(res, 500, `Error al actualizar la reserva de evento: ${error.message}`); 
        }
    }

    static async deleteReservaEvento(req, res) {
        try {
            const { id } = req.params;
            const deleted = await reservaEventoRepository.delete({ id });
            if (!deleted) {
                return sendError(res, 404, "Reserva de evento no encontrada o no se pudo eliminar.");
            }
            return sendSuccess(res, 200, "Reserva de evento eliminada exitosamente.");
        }catch(error){
            return sendError(res, 500, `Error al eliminar la reserva de evento: ${error.message}`);
        }
    }

    static async obtenerPorRangoFechas(req, res) {
        try {
            const { fechaInicio, fechaFin } = req.query;
            const reservas = await reservaEventoRepository.obtenerPorRangoFechas(fechaInicio, fechaFin);
            return sendSuccess(res, 200, "Reservas obtenidas exitosamente.", reservas);
        } catch (error) {
            return sendError(res, 500, `Error al obtener reservas por rango de fechas: ${error.message}`);
        }
    }

    static async contarReservasPorDia(req, res) {
        try {
            const { fecha } = req.params;
            const count = await reservaEventoRepository.contarReservasPorDia(fecha);
            return sendSuccess(res, 200, "Conteo de reservas por día obtenido exitosamente.", { count });
        } catch (error) {
            return sendError(res, 500, `Error al contar reservas por día: ${error.message}`);
        }
    }

    static async validarDisponibilidad(req, res) {
        try {
            const { articuloId, museoId, fechaInicio, fechaFin } = req.query;
            const disponible = await reservaEventoRepository.validarDisponibilidad(articuloId, museoId, fechaInicio, fechaFin);
            return sendSuccess(res, 200, "Disponibilidad verificada exitosamente.", { disponible });
        } catch (error) {
            return sendError(res, 500, `Error al validar disponibilidad: ${error.message}`);
        }
    }

    static async cancelarEvento(req, res){
        try{
            const { id } = req.params;
            const resultado = await reservaEventoRepository.cancelarEvento(id);
            if (!resultado) {
                return sendError(res, 404, "Reserva de evento no encontrada o no se pudo cancelar.");
            }
            return sendSuccess(res, 200, "Reserva de evento cancelada exitosamente.", resultado);
        } catch (error) {
            return sendError(res, 500, `Error al cancelar la reserva de evento: ${error.message}`);
        }
    }

    static async marcarComoAsistido(req, res){
        try{
            const { id } = req.params;
            const resultado = await reservaEventoRepository.marcarComoAsistido(id);
            if (!resultado) {
                return sendError(res, 404, "Reserva de evento no encontrada o no se pudo marcar como asistido.");
            }
            return sendSuccess(res, 200, "Reserva de evento marcada como asistido exitosamente.", resultado);
        } catch (error) {
            return sendError(res, 500, `Error al marcar la reserva de evento como asistido: ${error.message}`);
        }
    }

    static async obtenerPorDia(req, res){
        try{
            const { fecha } = req.params;
            const reservas = await reservaEventoRepository.obtenerPorDia(fecha);
            return sendSuccess(res, 200, "Reservas obtenidas exitosamente.", reservas);
        } catch (error) {
            return sendError(res, 500, `Error al obtener reservas por día: ${error.message}`);
        }
    }

    static async obtenerPorMuseo(req, res){
        try{
            const { museoId } = req.params;
            const reservas = await reservaEventoRepository.obtenerPorMuseo(museoId);
            return sendSuccess(res, 200, "Reservas obtenidas exitosamente.", reservas);
        } catch (error) {
            return sendError(res, 500, `Error al obtener reservas por museo: ${error.message}`);
        }
    }

    static async obtenerPorArticulo(req, res){
        try{
            const { articuloId } = req.params;
            const reservas = await reservaEventoRepository.obtenerPorArticulo(articuloId);
            return sendSuccess(res, 200, "Reservas obtenidas exitosamente.", reservas);
        } catch (error) {
            return sendError(res, 500, `Error al obtener reservas por artículo: ${error.message}`);
        }
    }
}