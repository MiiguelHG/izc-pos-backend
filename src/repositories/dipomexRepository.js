import db from "#models/index.js";

const { estado, municipio, codigoPostal, sequelize } = db;

export class DipomexRepository {
  static async createAll(estados, municipios, codigosPostales) {
    return sequelize.transaction(async (t) => {
      const newEstados = await estado.bulkCreate(estados, { transaction: t, validate: true });

      if (newEstados.length !== estados.length) {
        throw new Error(`Error creating estados - expected ${estados.length}, got ${newEstados.length}`);
      }
      const newMunicipios = await municipio.bulkCreate(municipios, { transaction: t, validate: true });

      if (newMunicipios.length !== municipios.length) {
        throw new Error(`Error creating municipios - expected ${municipios.length}, got ${newMunicipios.length}`);
      }

      // Hacer bulkCreate de códigos postales de 1000 en 1000 para evitar problemas de memoria
      const batchSize = 1000;
      for (let i = 0; i < codigosPostales.length; i += batchSize) {
        const batch = codigosPostales.slice(i, i + batchSize);
        const newCodigosPostales = await codigoPostal.bulkCreate(batch, { transaction: t, validate: true });
        if (newCodigosPostales.length !== batch.length) {
          throw new Error(`Error creating codigosPostales - expected ${batch.length}, got ${newCodigosPostales.length}`);
        }
      }

      return true;
    });
  }

  static async findAllCP() {
    return await codigoPostal.findAll();
  }
  
}