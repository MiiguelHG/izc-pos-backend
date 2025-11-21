import BaseRepository from "./baseRepository.js";
import db from "../models/index.js";

const { boletoTipo } = db;

class BoletoTipoRepository extends BaseRepository {
  constructor() {
    super(boletoTipo);
  }

  // async createBoletoTipo({ nombre, descripcion, descuento, precioFinal, articuloId }) {
  //   return await this.create({nombre, descripcion, descuento, precioFinal, articuloId});
  // }

  async findAllbyArticuloId(articuloId) {
    return await this.model.findAll({ where: { articuloId } });
  }
}

export const boletoTipoRepository = new BoletoTipoRepository();