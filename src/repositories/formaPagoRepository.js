import BaseRepository from "./baseRepository.js";
import db from "../models/index.js";

const { formaPago } = db;

class FormaPagoRepository extends BaseRepository {
    constructor() {
        super(formaPago);
    }

    findFormasPago({isAdmin}) {
        const whereClause = isAdmin ? {} : { activo: true };
        return this.model.findAll({ where: whereClause });
    }
}

export const formaPagoRepository = new FormaPagoRepository();