import BaseRepository from "./baseRepository.js";
import db from "../models/index.js";
import { Op } from "sequelize";

const { articulo, museo, museoHasArticulo, sequelize } = db;

class ArticuloRepository extends BaseRepository {
    constructor() {
        super(articulo);
    }

    async findAndCountAll ({ seleccion, limit, offset, rol, search = '' }) {
        const tiposPermitidos = ['producto', 'servicio'];
        const whereClause = {};

        whereClause.tipo = tiposPermitidos.includes(seleccion)
            ? seleccion
            : { [Op.in]: tiposPermitidos };

        if (search) {
            whereClause[Op.or] = [
                { nombre: { [Op.like]: `%${search}%` } },
                { descripcion: { [Op.like]: `%${search}%` } }
            ];
        }

        if (rol !== 'admin') {
            whereClause.habilitado = true;
        }

        return await this.model.findAndCountAll({
            where: whereClause,
            limit,
            offset
        })
    }

    async getArticuloById(id) {
        return await this.findById(id);
    }
    
    async obtenerPorTipo(tipo) {
        return await this.findAll({ where: { tipo } });
    }

    async obtenerServiciosPorMuseo(museoId) {
        return await this.model.findAll({
            where: { tipo: 'servicio' },
            include: [{
                model: museo, as: 'museos',
                where: { id: museoId },
                through: { attributes: [] }
            }]
        });
    }

    async updateHabilitado({id}) {
        return await sequelize.transaction(async (t) => {
            const articuloInstance = await this.model.findByPk(id, { transaction: t });
            if (!articuloInstance) {
                throw new Error(`Artículo con ID ${id} no encontrado`);
            }
            const enable = !articuloInstance.habilitado;

            // instance.update() devuelve la instancia actualizada
            const updatedArticulo = await articuloInstance.update({ habilitado: enable }, { transaction: t });

            if (!updatedArticulo) {
                throw new Error(`No se pudo actualizar el estado del artículo con ID ${id}`);
            }

            // Actualiza todas las asociaciones del artículo con museos en una sola consulta
            // Si no tiene asociaciones, affectedCount será 0 y no es un error
            await museoHasArticulo.update({ habilitado: enable }, { where: { articuloId: id }, transaction: t });

            return true;
        });
    }
}

export const articuloRepository = new ArticuloRepository();