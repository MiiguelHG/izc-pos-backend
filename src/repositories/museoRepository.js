import BaseRepository from "./baseRepository.js";
import db from "../models/index.js";

const { museo, ubicacion, sequelize } = db;

class MuseoRepository extends BaseRepository {
    constructor(){
        super(museo);
    }

    async createMuseo({nombre, ubicacion: { calle, numero, colonia, ciudad, estado, codigoPostal }}) {
        return await sequelize.transaction(async (t) => {
            const newUbicacion = await ubicacion.create({
                calle,
                numero,
                colonia,
                ciudad,
                estado,
                codigoPostal
            }, { transaction: t });

            if (!newUbicacion) {
                throw new Error('No se pudo crear la ubicación');
            }

            const newMuseo = await museo.create({
                nombre,
                ubicacionId: newUbicacion.id
            }, { transaction: t });
            if (!newMuseo) {
                throw new Error('No se pudo crear el museo');
            }
            return newMuseo;
        });
    }

    async findAndCountAll({limit = 10, offset = 0}) {
        return await this.model.findAndCountAll({
            limit,
            offset,
            include: [
                { model: ubicacion, as: "ubicacion" }
            ]
        });
    }

    async updateMuseo(id, {nombre, ubicacion: { calle, numero, colonia, ciudad, estado, codigoPostal }}) {
        return await sequelize.transaction(async (t) => {
            const museoToUpdate = await this.model.findByPk(id, { transaction: t });
            if (!museoToUpdate) {
                throw new Error('Museo no encontrado');
            }
            const ubicacionToUpdate = await ubicacion.findByPk(museoToUpdate.ubicacionId, { transaction: t });
            if (!ubicacionToUpdate) {
                throw new Error('Ubicación no encontrada');
            }
            const updatedUbicacion = await ubicacionToUpdate.update({
                calle,
                numero,
                colonia,
                ciudad,
                estado,
                codigoPostal
            }, { transaction: t });

            if (!updatedUbicacion) {
                throw new Error('No se pudo actualizar la ubicación');
            }

            const updatedMuseo = await museoToUpdate.update({
                nombre
            }, { transaction: t });

            if (!updatedMuseo) {
                throw new Error('No se pudo actualizar el museo');
            }
            return updatedMuseo ;
        });
    }

}

export const museoRepository = new MuseoRepository();

    

    

    

    