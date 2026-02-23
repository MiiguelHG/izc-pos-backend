import BaseRepository from "./baseRepository.js";
import db from "#models/index.js";
import { Op } from "sequelize";

const { museoHasArticulo, articulo } = db;

class MuseoHasArticuloRepository extends BaseRepository {
    constructor() {
        super(museoHasArticulo);
    }

    async getbyId(museoId, articuloId) {
        return await this.model.findOne({ where: { museoId, articuloId } });
    }

    // Reemplazar las relaciones de un museo sin validar existencia
    async setArticulos(museoId, articuloIds = []){
        const t = await db.sequelize.transaction();
        try{
            await this.model.destroy({ where: { museoId }, transaction: t });
            const rows = articuloIds.map(aid => ({ museoId, articuloId: aid }));
            if(rows.length > 0) await this.model.bulkCreate(rows, { transaction: t });
            await t.commit();
            return true;
        }catch(err){
            await t.rollback();
            throw err;
        }
    }

    async getArticulosByMuseo({museoId, tipo, limit = 10, offset = 0, isOperador }) {
        const defalutTipo = { [Op.or]: [ {tipo: 'servicio'}, {tipo: 'producto'}] };
        const habilitados = isOperador ? { where: { habilitado: true } } : {};
        
        return await articulo.findAndCountAll({
            where: tipo !== 'todos' ? { tipo: tipo } : defalutTipo,
            include: [
                { 
                    model: db.museo, as: 'museos', 
                    where: { id: museoId }, 
                    attributes: [],
                    through: habilitados // ✅ Solo artículos habilitados si es operador
                }
            ],
            limit,
            offset
        });
    }
}

export const museoHasArticuloRepository = new MuseoHasArticuloRepository();