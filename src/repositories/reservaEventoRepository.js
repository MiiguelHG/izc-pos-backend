import BaseRepository from "./baseRepository.js";
import db from "../models/index.js";
import { Op } from "sequelize";

const { reservaEvento, sequelize, visitante, museo } = db;

const createHttpError = (status, message) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

class ReservaEventoRepository extends BaseRepository {
    constructor() {
        super(reservaEvento);
    }

    async createReservaEventoCompleta({nombre, edad, cp, pais, estadoId, municipioId, cantidadHombres, cantidadMujeres, cantidadOtros, nombreEvento, responsable, contactoResponsable, capacidad, fechaReserva, fechaInicio, fechaFin, total, estadoReserva, usuarioId, museoId, articuloId, formaPagoId}) {
        return await sequelize.transaction(async (t) => {
            const museoBloqueado = await museo.findByPk(museoId, {
                transaction: t,
                lock: t.LOCK.UPDATE
            });

            if (!museoBloqueado) {
                throw createHttpError(404, `Museo con ID ${museoId} no encontrado.`);
            }

            const disponible = await this.validarDisponibilidad(museoId, fechaInicio, fechaFin, t);
            if (!disponible) {
                throw createHttpError(409, "Ya existe una reserva en este horario.");
            }

            const reservasHoy = await this.contarReservasPorDia(fechaInicio, t);
            const LIMITE = 10;

            if (reservasHoy >= LIMITE) {
                throw createHttpError(400, "Se alcanzó el límite de reservas para este día.");
            }

            const totalVisitantes = Number(cantidadHombres) + Number(cantidadMujeres) + Number(cantidadOtros);

            if (totalVisitantes <= 0) {
                throw new Error("El total de visitantes debe ser mayor a cero.");
            }

            const nuevoVisitante = await visitante.create(
                {
                    nombre,
                    edad,
                    cp,
                    pais,
                    estadoId,
                    municipioId,
                    cantidadHombres,
                    cantidadMujeres,
                    cantidadOtros,
                    totalVisitantes,
                    museoId,
                    usuarioId
                },
                { transaction: t }
            );

            if (!nuevoVisitante) {
                throw new Error("No se pudo crear el visitante.");
            }

            const nuevaReservaEvento = await this.model.create(
                {
                    nombreEvento,
                    responsable,
                    contactoResponsable,
                    capacidad,
                    fechaReserva,
                    fechaInicio,
                    fechaFin,
                    total,
                    estado: estadoReserva,
                    usuarioId,
                    museoId,
                    articuloId,
                    visitanteId: nuevoVisitante.id,
                    formaPagoId
                },
                { transaction: t }
            );

            // devolver el registro con información del visitante para facilitar al controller
            return {
                ...nuevaReservaEvento.toJSON(),
                visitante: nuevoVisitante.toJSON()
            };
        });
    }

    async obtenerPorRangoFechas(museoId, fechaInicio, fechaFin) {
        return await this.findAll({
            where: {
                museoId,
                [Op.or]: [
                    {
                        fechaInicio: { [Op.between]: [fechaInicio, fechaFin] },
                    },
                    {
                        fechaFin: { [Op.between]: [fechaInicio, fechaFin] },
                    },
                    {
                        fechaInicio: { [Op.lte]: fechaInicio },
                        fechaFin: { [Op.gte]: fechaFin },
                    }
                ]
            }
        });
    }

    async contarReservasPorDia(fecha, transaction = null) {
        const fechaBase = typeof fecha === "string" && fecha.includes("T")
            ? fecha.slice(0, 10)
            : fecha;

        const inicioDia = new Date(fechaBase);
        inicioDia.setHours(0, 0, 0, 0);
        const finDia = new Date(fechaBase);
        finDia.setHours(23, 59, 59, 999);

        return await this.model.count({
            where: {
                fechaInicio: {
                    [Op.between]: [inicioDia, finDia]
                }
            },
            transaction
        });
    }

    async validarDisponibilidad(museoId, fechaInicio, fechaFin, transaction = null) {
        const count = await this.model.count({
            where: {
                museoId,
                estado: { [Op.ne]: 'cancelado' },
                [Op.and]: [
                    {
                        fechaInicio: { [Op.lt]: fechaFin }
                    },
                    {
                        fechaFin: { [Op.gt]: fechaInicio }
                    }
                ]
            },
            transaction
        });
        return count === 0;
    }

    async conflictosReserva(museoId, fechaInicio, fechaFin, id) {
        return await this.model.count({
            where: {
                museoId,
                estado: { [Op.ne]: 'cancelado' },
                id: { [Op.ne]: Number(id) },
                [Op.and]: [
                    { fechaInicio: { [Op.lt]: fechaFin } },
                    { fechaFin: { [Op.gt]: fechaInicio } }  
                ]
            }
        });
    }

    async cancelarEvento(id){
        return await this.update({ id }, { estado: 'cancelado' });
    }

    async marcarComoAsistido(id){
        return await this.update({ id }, { estado: 'asistido' });
    }

    async obtenerPorDia(fecha) {
        return this.findAll({
            where: {
                fechaInicio: {
                    [Op.between]: [
                        `${fecha} 00:00:00`,
                        `${fecha} 23:59:59`
                    ]
                }
            }
        });
    }

    async obtenerPorMuseoId(museoId) {
        return this.findAll({
            where: {
                museoId
            }
        });
    }

    async obtenerPorArticuloId(articuloId) {
        return this.findAll({
            where: {
                articuloId
            }
        });
    }

}

export const reservaEventoRepository = new ReservaEventoRepository();