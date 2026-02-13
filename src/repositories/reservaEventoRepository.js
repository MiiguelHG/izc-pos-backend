import BaseRepository from "./baseRepository.js";
import db from "../models/index.js";
import { Op } from "sequelize";

const { reservaEvento } = db;

class ReservaEventoRepository extends BaseRepository {
    constructor() {
        super(reservaEvento);
    }

    async obtenerPorRangoFechas(museoId, fechaInicio, fechaFin) {
        return await this.findAll({
            where: {
                museoId,
                estado: { [Op.ne]: 'cancelado' },
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

    async contarReservasPorDia(fecha) {
        const inicioDia = new Date(fecha);
        inicioDia.setHours(0, 0, 0, 0);
        const finDia = new Date(fecha);
        finDia.setHours(23, 59, 59, 999);

        return await this.model.count({
            where: {
                fechaInicio: {
                    [Op.between]: [inicioDia, finDia]
                }
            }
        });
    }

    async validarDisponibilidad(museoId, fechaInicio, fechaFin) {
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
            }
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