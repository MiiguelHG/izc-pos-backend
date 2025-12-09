import { toMx, obtenerFechaActualMx } from "#utils/date.js";
import { reservaEventoRepository } from "#repositories/index.js";
import { sendError } from "#utils/responseFormater.js";

export async function validarReserva(req, res, next) {
    try {
        const data = req.body;
        const { fechaInicio, fechaFin, articuloId, museoId } = data;

        const inicio = toMx(fechaInicio);
        const fin = toMx(fechaFin);

        const hoy = obtenerFechaActualMx().startOf("day");
        const fechaReserva = obtenerFechaActualMx().toISODate();

        if (!inicio.isValid || !fin.isValid) {
            return sendError(res, 400, "Formato de fecha inválido.");
        }

        if (inicio < hoy) {
            return sendError(res, 400, "La fecha de inicio no puede ser anterior a la fecha actual.");
        }

        if (fin <= inicio) {
            return sendError(res, 400, "La fecha de fin debe ser posterior a la fecha de inicio.");
        }

        if (fin.diff(inicio, "minutes").minutes < 30) {
            return sendError(res, 400, "La duración mínima del evento es de 30 minutos.");
        }

        const HORA_MIN = 10;
        const HORA_MAX = 22;

        if (inicio.hour < HORA_MIN) {
            return sendError(res, 400, "Los eventos no pueden iniciar antes de las 10:00 horas.");
        }

        // límite: terminar antes o igual a las 22:00
        const limite = inicio.set({ hour: HORA_MAX, minute: 0, second: 0 });
        if (fin > limite) {
            return sendError(res, 400, "Los eventos deben terminar a más tardar a las 22:00 horas.");
        }

        // VALIDACIÓN DE DISPONIBILIDAD EN BD
        const disponible = await reservaEventoRepository.validarDisponibilidad(
            articuloId,
            museoId,
            inicio.toISO(),
            fin.toISO()
        );

        if (!disponible) {
            return sendError(res, 409, "Ya existe una reserva en este horario.");
        }

        const reservasHoy = await reservaEventoRepository.contarReservasPorDia(inicio.toISODate());
        const LIMITE = 10;

        if (reservasHoy >= LIMITE) {
            return sendError(res, 400, "Se alcanzó el límite de reservas para este día.");
        }

        // Si todo está bien, guardamos la info preparada para el controller
        req.reservaData = {
            ...data,
            fechaReserva,
            fechaInicio: inicio.toISO(),
            fechaFin: fin.toISO()
        };

        next();

    } catch (error) {
        return sendError(res, 500, `Error al validar la reserva: ${error.message}`);
    }
}

export async function validarActualizacionReserva(req, res, next) {
    try {
        const id = req.params.id;
        const data = req.body;

        const {
            responsable,
            contactoResponsable,
            fechaInicio,
            fechaFin,
            total,
            estado,
            usuarioId,
            museoId,
            articuloId,
            visitanteId,
            formaPagoId
        } = data;

        const inicio = toMx(fechaInicio);
        const fin = toMx(fechaFin);

        if (!inicio.isValid || !fin.isValid) {
            return sendError(res, 400, "Formato de fecha inválido.");
        }

        const hoy = obtenerFechaActualMx().startOf("day");

        if (inicio < hoy) {
            return sendError(res, 400, "La fecha de inicio no puede ser anterior a la fecha actual.");
        }

        if (fin <= inicio) {
            return sendError(res, 400, "La fecha de fin debe ser posterior a la fecha de inicio.");
        }

        if (fin.diff(inicio, "minutes").minutes < 30) {
            return sendError(res, 400, "La duración mínima del evento es de 30 minutos.");
        }

        const HORA_MIN = 10;
        const HORA_MAX = 22;

        if (inicio.hour < HORA_MIN) {
            return sendError(res, 400, "Los eventos no pueden iniciar antes de las 10:00 horas.");
        }

        const limite = inicio.set({ hour: HORA_MAX, minute: 0, second: 0 });
        if (fin > limite) {
            return sendError(res, 400, "Los eventos deben terminar a más tardar a las 22:00 horas.");
        }

        // Verificar que exista
        const existente = await reservaEventoRepository.findById(id);
        if (!existente) {
            return sendError(res, 404, "Reserva no encontrada.");
        }

        // Validación de conflicto
        const inicioLocal = inicio.toISO();
        const finLocal = fin.toISO();

        const conflictos = await reservaEventoRepository.conflictosReserva(
            articuloId,
            museoId,
            inicioLocal,
            finLocal,
            id
        );

        if (conflictos > 0) {
            return sendError(res, 409, "Ya existe una reserva en este horario.");
        }

        // Límite de reservas si cambia de día
        const nuevaFecha = inicio.toISODate();
        const fechaOriginal = existente.fechaInicio
            ? new Date(existente.fechaInicio).toISOString().slice(0, 10)
            : null;

        const reservasHoy = await reservaEventoRepository.contarReservasPorDia(nuevaFecha);
        const LIMITE = 10;

        if (fechaOriginal !== nuevaFecha && reservasHoy >= LIMITE) {
            return sendError(res, 400, "Se ha alcanzado el límite de reservas para este día.");
        }

        // Guardar info final en req
        req.reservaActualizada = {
            ...data,
            fechaInicio: inicioLocal,
            fechaFin: finLocal
        };

        next();

    } catch (error) {
        return sendError(res, 500, `Error al validar la actualización: ${error.message}`);
    }
}
