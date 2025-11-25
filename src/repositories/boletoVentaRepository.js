import BaseRepository from "./baseRepository.js";
import db from "../models/index.js";

const { boletoVenta } = db;

class BoletoVentaRepository extends BaseRepository {
  constructor() {
    super(boletoVenta);
  }

  async createMultiple(boletosData = [], options = {}) {
    return await this.model.bulkCreate(boletosData, options);
  }
}

export const boletoVentaRepository = new BoletoVentaRepository();