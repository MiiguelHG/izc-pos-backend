import BaseRepository from "./baseRepository.js";
import db from "../models/index.js";

const { boletoTipo, sequelize, articulo } = db;

class BoletoTipoRepository extends BaseRepository {
  constructor() {
    super(boletoTipo);
  }

  async updatePrecioFinalByArticuloId({ articuloId, precioEstandar }) {
    return await sequelize.transaction(async (t) => {
      // Buscar el articulo (boleto base)
        const updated = await articulo.update(
          { precioEstandar },
          { where: { id: articuloId }, transaction: t }
        );

        if (updated[0] !== 1) {
          throw new Error(`Articulo con ID ${articuloId} no encontrado o no se pudo actualizar`);
        }

        // Actualizar los precios finales de los tipos de boleto asociados
  const tiposBoletos = await this.model.findAll({ where: { articuloId }, transaction: t });

        if (!tiposBoletos || tiposBoletos.length === 0) {
          throw new Error(`No se encontraron tipos de boleto para el articulo con ID ${articuloId}`);
        }

        let countUpdated = 0;

        for (const boleto of tiposBoletos) {
          const precioFinal = precioEstandar - (precioEstandar * (boleto.descuento / 100));
          const updated = await this.model.update(
            { precioFinal },
            { where: { id: boleto.id }, transaction: t }
          );

          if (updated[0] !== 1) {
            throw new Error(`No se pudo actualizar el tipo de boleto con ID ${boleto.id}`);
          }

          countUpdated++;
        }

        if (countUpdated !== tiposBoletos.length) {
          throw new Error(`No se pudieron actualizar todos los tipos de boleto para el articulo con ID ${articuloId}`);
        }

        return true;
    });
  }
}

export const boletoTipoRepository = new BoletoTipoRepository();