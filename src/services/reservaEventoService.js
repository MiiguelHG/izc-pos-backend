import { reservaEventoRepository } from "#repositories/index.js";
import { toMx, obtenerFechaActualMx } from "#utils/date.js";
import { Op } from "sequelize";

export class ReservaEventoService {
    static async crearReserva(data) {

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

        // PARSE REAL EN MX
        const inicio = toMx(fechaInicio);
        const fin = toMx(fechaFin);

        const hoy = obtenerFechaActualMx().startOf("day");
        const fechaReserva = obtenerFechaActualMx().toISODate();

        if (!inicio.isValid || !fin.isValid) {
            throw new Error("Formato de fecha inválido.");
        }

        // No reservar días pasados
        if (inicio < hoy) {
            throw new Error("La fecha de inicio no puede ser anterior a la fecha actual.");
        }

        if (fin <= inicio) {
            throw new Error("La fecha de fin debe ser posterior a la fecha de inicio.");
        }

        if (fin.diff(inicio, "minutes").minutes < 30) {
            throw new Error("La duración mínima del evento es de 30 minutos.");
        }

        const HORA_MIN = 10;
        const HORA_MAX = 22;

        // No iniciar antes de las 10:00
        if (inicio.hour < HORA_MIN) {
            throw new Error("Los eventos no pueden iniciar antes de las 10:00 horas.");
        }

        // No terminar después de las 22:00 exactas
        if (fin > inicio.set({ hour: HORA_MAX, minute: 0, second: 0 })) {
            throw new Error("Los eventos deben terminar a más tardar a las 22:00 horas.");
        }

        // VALIDACIÓN BD (se usa UTC porque Sequelize convertirá)
        const disponibilidad = await reservaEventoRepository.validarDisponibilidad(
            articuloId,
            museoId,
            inicio.toUTC().toISO(),
            fin.toUTC().toISO()
        );

        if (!disponibilidad) {
            throw new Error("Ya existe una reserva en este horario");
        }

        const reservasHoy = await reservaEventoRepository.contarReservasPorDia(inicio.toISODate());
        const LIMITE_RESERVAS_DIARIAS = 10;

        if (reservasHoy >= LIMITE_RESERVAS_DIARIAS) {
            throw new Error("Se ha alcanzado el límite de reservas para este día.");
        }

        // GUARDAR EN UTC AUTOMÁTICAMENTE
        return await{
            ...data,
            fechaReserva,
            fechaInicio: inicio.toUTC().toISO(),
            fechaFin: fin.toUTC().toISO()
        };
    }

    static async actualizarReserva() {
        // Implemented in the service: actualizarReserva(id, data)
    }

    static async actualizarReserva(id, data) {
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

        // PARSE REAL EN MX
        const inicio = toMx(fechaInicio);
        const fin = toMx(fechaFin);

        if (!inicio.isValid || !fin.isValid) {
            throw new Error("Formato de fecha inválido.");
        }

        const hoy = obtenerFechaActualMx().startOf("day");

        // No permitir mover a días pasados
        if (inicio < hoy) {
            throw new Error("La fecha de inicio no puede ser anterior a la fecha actual.");
        }

        if (fin <= inicio) {
            throw new Error("La fecha de fin debe ser posterior a la fecha de inicio.");
        }

        if (fin.diff(inicio, "minutes").minutes < 30) {
            throw new Error("La duración mínima del evento es de 30 minutos.");
        }

        const HORA_MIN = 10;
        const HORA_MAX = 22;

        if (inicio.hour < HORA_MIN) {
            throw new Error("Los eventos no pueden iniciar antes de las 10:00 horas.");
        }

        if (fin > inicio.set({ hour: HORA_MAX, minute: 0, second: 0 })) {
            throw new Error("Los eventos deben terminar a más tardar a las 22:00 horas.");
        }

        // Verificar que la reserva exista
        const existente = await reservaEventoRepository.findById(id);
        if (!existente) {
            throw new Error("Reserva no encontrada.");
        }

        // VALIDACIÓN BD (excluir la reserva actual)
        const fechaInicioUTC = inicio.toUTC().toISO();
        const fechaFinUTC = fin.toUTC().toISO();

        const conflictos = await reservaEventoRepository.model.count({
            where: {
                articuloId,
                museoId,
                id: { [Op.ne]: id },
                [Op.and]: [
                    { fechaInicio: { [Op.lt]: fechaFinUTC } },
                    { fechaFin: { [Op.gt]: fechaInicioUTC } }
                ]
            }
        });

        if (conflictos > 0) {
            throw new Error("Ya existe una reserva en este horario");
        }

        // Límite diario: si se mueve de día, validar límite en nuevo día
        const inicioISODate = inicio.toISODate();
        const existingInicioDate = existente.fechaInicio ? new Date(existente.fechaInicio).toISOString().slice(0, 10) : null;

        const reservasHoy = await reservaEventoRepository.contarReservasPorDia(inicioISODate);
        const LIMITE_RESERVAS_DIARIAS = 10;

        // Si se está moviendo a un día distinto al actual de la reserva, validar límite
        if (existingInicioDate !== inicioISODate && reservasHoy >= LIMITE_RESERVAS_DIARIAS) {
            throw new Error("Se ha alcanzado el límite de reservas para este día.");
        }

        // Preparar datos a guardar (se espera UTC)
        const payload = {
            responsable,
            contactoResponsable,
            fechaInicio: fechaInicioUTC,
            fechaFin: fechaFinUTC,
            total,
            estado,
            usuarioId,
            museoId,
            articuloId,
            visitanteId,
            formaPagoId
        };

        const updated = await reservaEventoRepository.update({ id }, payload);
        return updated;
    }
}
