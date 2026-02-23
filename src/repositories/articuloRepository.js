import BaseRepository from "./baseRepository.js";
import db from "../models/index.js";
import { Op } from "sequelize";

const { articulo, museoHasArticulo, sequelize } = db;

class ArticuloRepository extends BaseRepository {
    constructor() {
        super(articulo);
    }

    async findAndCountAll ({ seleccion = '', limit, offset }) {
        const defalutClause = { [Op.or]: [ {tipo: 'servicio'}, {tipo: 'producto'}] };
        const whereClause = seleccion ? { tipo: seleccion } : defalutClause;

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