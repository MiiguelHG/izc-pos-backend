import BaseRepository from "./baseRepository.js";
import db from "#models/index.js";

const { museoHasArticulo, articulo } = db;

class MuseoHasArticuloRepository extends BaseRepository {
    constructor() {
        super(museoHasArticulo);
    }

    // Remover relación sin validación
    async removeArticulo(museoId, articuloId){
        return await this.model.destroy({ where: { museoId, articuloId } });
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

    async getArticulosByMuseo({museoId, tipo, limit = 10, offset = 0 }) {
        return await articulo.findAndCountAll({
            where: tipo ? { tipo: tipo } : {},
            include: [
                { 
                    model: db.museo, as: 'museos', 
                    where: { id: museoId }, 
                    attributes: [] 
                }
            ],
            limit,
            offset
        });
    }
}

export const museoHasArticuloRepository = new MuseoHasArticuloRepository();