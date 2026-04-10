import { toMx, obtenerFechaActualMx } from "#utils/date.js";
import { reservaEventoRepository } from "#repositories/index.js";
import { sendError } from "#utils/responseFormater.js";

export async function validarReserva(req, res, next) {
    try {
        const data = req.body;
        const usuarioId = req.user.id;
        const { fechaInicio, fechaFin, articuloId, nombre, edad, cp, pais, estadoId, municipioId, cantidadHombres, cantidadMujeres, cantidadOtros } = data;

        let museoId;

        if(req.user.rol.id === 1){
            museoId = req.body.museoId;
        }else{
            museoId = req.user.museoId;
        }

        // Validar campos requeridos del visitante
        const camposVisitantes = { nombre, edad, cp, pais, estadoId, municipioId, cantidadHombres, cantidadMujeres, cantidadOtros };
        for (const [campo, valor] of Object.entries(camposVisitantes)) {
            if (valor === undefined || valor === null || valor === '') {
                return sendError(res, 400, `El campo '${campo}' es requerido para el visitante.`);
            }
        }

        // Validar que cantidades sean números
        const cantidades = { cantidadHombres, cantidadMujeres, cantidadOtros };
        for (const [campo, valor] of Object.entries(cantidades)) {
            if (isNaN(valor) || valor < 0) {
                return sendError(res, 400, `El campo '${campo}' debe ser un número mayor o igual a cero.`);
            }
        }

        const totalVisitantes = Number(cantidadHombres) + Number(cantidadMujeres) + Number(cantidadOtros);
        if (totalVisitantes <= 0) {
            return sendError(res, 400, "El total de visitantes (hombres + mujeres + otros) debe ser mayor a cero.");
        }

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
            return sendError(res, 400, "Los eventos no pueden iniciar antes de las 10:00 am.");
        }

        // límite: terminar antes o igual a las 22:00
        const limite = inicio.set({ hour: HORA_MAX, minute: 0, second: 0 });
        if (fin > limite) {
            return sendError(res, 400, "Los eventos deben terminar a más tardar a las 10:00 pm.");
        }

        // VALIDACIÓN DE DISPONIBILIDAD EN BD
        const disponible = await reservaEventoRepository.validarDisponibilidad(
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

        if (data.estado != "reservado") {
            return sendError(res, 400, "La reserva fue finalizada.");
        }

        // Validar el contacto del responsable (debe ser un número celular de 10 dígitos)
        let contacto = data.contactoResponsable;

        if(!contacto){
            return sendError(res, 400, "El contacto del responsable es requerido.");
        }

        contacto = contacto.replace(/\D/g, ''); // Eliminar cualquier carácter no numérico

        const regex = /^\+?[1-9]\d{7,14}$/;

        if (!regex.test(contacto)) {
            return sendError(res, 400, "El contacto del responsable debe ser un número de teléfono celular válido.");
        }

        if (/^(\d)\1+$/.test(contacto)) {
            return sendError(res, 400, "El contacto del responsable no puede ser un número con todos los dígitos iguales.");
        }

        if ("0123456789".includes(contacto)) {
            return sendError(res, 400, "El contacto del responsable no puede ser un número ascendente.");
        }

        if ("9876543210".includes(contacto)) {
            return sendError(res, 400, "El contacto del responsable no puede ser un número descendente.");
        }

        const capacidad = cantidadHombres + cantidadMujeres + cantidadOtros;
        
        data.capacidad = capacidad;

        // Si todo está bien, guardamos la info preparada para el controller
        req.reservaData = {
            ...data,
            usuarioId,
            museoId,
            fechaReserva,
            fechaInicio: inicio.toISO(),
            fechaFin: fin.toISO(),
            estadoReserva: data.estado || 'reservado',
            totalVisitantes
        };

        next();

    } catch (error) {
        return sendError(res, 500, `Error al validar la reserva: ${error.message}`);
    }
}

export async function validarActualizacionReserva(req, res, next) {
    try {
        const {id} = req.params;
        const data = req.body;

        const usuarioId = req.user.id;
        
        let museoId;

        if(req.user.rol.id === 1){
            museoId = req.body.museoId;
        }else{
            museoId = req.user.museoId;
        }

        const {
            articuloId,
            fechaInicio,
            fechaFin
        } = req.body

        const {
            responsable,
            contactoResponsable,
            total,
            estado,
            visitanteId,
            formaPagoId
        } = data;

        const inicio = toMx(fechaInicio);
        const fin = toMx(fechaFin);

        console.log("🔥 VALIDANDO UPDATE RESERVA", {
            id: req.params.id,
            body: req.body,
            user: req.user
        });

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

        console.log("⏱️ BUSCANDO CONFLICTOS", {
            articuloId,
            museoId,
            inicioLocal,
            finLocal,
        });

        const conflictos = await reservaEventoRepository.conflictosReserva(
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
            articuloId,
            usuarioId,
            museoId,
            fechaInicio: inicioLocal,
            fechaFin: finLocal
        };

        next();

    } catch (error) {
        return sendError(res, 500, `Error al validar la actualización: ${error.message}`);
    }
}
