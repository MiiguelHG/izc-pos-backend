import BaseRepository from "./baseRepository.js";
import db from "../models/index.js";

const { formaPago } = db;

class FormaPagoRepository extends BaseRepository {
    constructor() {
        super(formaPago);
    }
}

export const formaPagoRepository = new FormaPagoRepository();