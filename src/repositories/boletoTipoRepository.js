import BaseRepository from "./baseRepository.js";
import db from "../models/index.js";

const { boletoTipo } = db;

class BoletoTipoRepository extends BaseRepository {
  constructor() {
    super(boletoTipo);
  }

  async findAllbyArticuloId(articuloId) {
    return await this.model.findAll({ where: { articuloId } });
  }
}

export const boletoTipoRepository = new BoletoTipoRepository();