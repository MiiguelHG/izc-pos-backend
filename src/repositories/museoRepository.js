import BaseRepository from "./baseRepository.js";
import db from "../models/index.js";

const { museo, articulo, museoHasArticulo } = db;

class MuseoRepository extends BaseRepository {
    constructor(){
        super(museo);
    }

    async findAndCountAll({limit = 10, offset = 0}) {
        return await this.model.findAndCountAll({
            limit,
            offset
        });
    }

    async getArticulosByMuseo(museoId, { limit = 10, offset = 0 } = {}) {
        const include = [{model: articulo, as: 'articulos'}];
        const options = { include };
        if (limit != null) options.limit = limit;
        if (offset != null) options.offset = offset;
        const instance = await this.findById(museoId, options);
        return instance ? instance.articulos : [];
    }

    async getMuseosByArticulos(articuloId){
        const articulo = await articulo.findByPk(articuloId, {
            include: [{ model: museo, as: 'museos' }]
        });
        return articulo ? articulo.museos : [];
    }

    async addArticulo(museoId, articuloId){
        const m = await this.findById(museoId);
        if(!m) throw new Error('Museo no encontrado');
        if (typeof m.addArticulo === 'function'){
            return await m.addArticulo(articuloId);
        }
        return await museoHasArticulo.create({ museoId, articuloId });
    }

    async removeArticulo(museoId, articuloId){
        const m = await this.findById(museoId);
        if(!m) throw new Error('Museo no encontrado');
        if (typeof m.removeArticulo === 'function'){
            return await m.removeArticulo(articuloId);
        }
        return await museoHasArticulo.destroy({ where: { museoId, articuloId } });
    }

    async setArticulos(museoId, articuloIds = []){
        const m = await this.findById(museoId);
        if(!m) throw new Error('Museo no encontrado');
        if (typeof m.setArticulos === 'function'){
            return await m.setArticulos(articuloIds);
        }
        const t = await db.sequelize.transaction();
        try{
            await db.museoHasArticulo.destroy({ where: { museoId }, transaction: t });
            const rows = articuloIds.map(aid => ({ museoId, articuloId: aid }));
            if(rows.length > 0) await db.museoHasArticulo.bulkCreate(rows, { transaction: t });
            await t.commit();
            return true;
        }catch(err){
            await t.rollback();
            throw err;
        }
    }

    async hasArticulo(museoId, articuloId){
        const m = await this.findById(museoId);
        if(!m) return false;
        if (typeof m.hasArticulo === 'function'){
            return await m.hasArticulo(articuloId);
        }
        const count = await db.museoHasArticulo.count({ where: { museoId, articuloId } });
        return count > 0;
    }

    async countRelaciones(museoId){
        return await db.museoHasArticulo.count({ where: { museoId } });
    }
}

export const museoRepository = new MuseoRepository();

    

    

    

    