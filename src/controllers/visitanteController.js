import { visitanteRepository } from "#repositories/visitanteRepository.js";
import { sendSuccess, sendError } from "#utils/responseFormater.js";

export class VisitanteController {
    static async getAllVisitantes(req, res) {
        try {
            const limit = 10;
            const page = parseInt(req.query.page) || 1;
            const offset = (page - 1) * limit;

            const { rows, count } = await visitanteRepository.findAllVisitantes({limit, offset});

            if (count === 0) {
                return sendSuccess(res, 200, "No se encontraron visitantes.");
            }

            const totalPages = Math.ceil(count / limit);

            return sendSuccess(res, 200, "Visitantes obtenidos correctamente.", {
                data: rows,
                meta: {
                    totalItems: count,
                    currentPage: page,
                    totalPages: totalPages,
                    pageSize: limit}
            });
        } catch(error) {
            return sendError(res, 500, `Error al obtener visitantes. ${error.message}`);
        }
    }

    static async getAllVisitantesByMuseoId(req, res) {
        try {
            const { museoId } = req.params;
            const limit = 10;
            const page = parseInt(req.query.page) || 1;
            const offset = (page - 1) * limit;

            const { rows, count } = await visitanteRepository.findAllVisitantesByMuseoId({museoId, limit, offset});

            if (count === 0) {
                return sendSuccess(res, 200, "No se encontraron visitantes para este museo.");
            }

            const totalPages = Math.ceil(count / limit);

            return sendSuccess(res, 200, "Visitantes obtenidos correctamente.", {
                data: rows,
                meta: {
                    totalItems: count,
                    currentPage: page,
                    totalPages: totalPages,
                    pageSize: limit}
            });
        } catch(error) {
            return sendError(res, 500, `Error al obtener visitantes por museo. ${error.message}`);
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;

            const visitante = await visitanteRepository.findById(id);

            if(!visitante){
                return sendError(res, 404, "Visitante no encontrado.");
            }

            return sendSuccess(res, 200, "Visitante obtenido correctamente.", visitante);
        } catch(error) {
            return sendError(res, 500, `Error al obtener visitante por ID. ${error.message}`);
        }
    }

    static async createVisitante(req, res) {
        try {
            const { 
                nombre,
                edad,
                cp,
                estado,
                pais,
                cantidadHombres,
                cantidadMujeres,
                cantidadOtros,
                museoId,
                usuarioId
            } = req.body;

            const totalVisitantes = cantidadHombres + cantidadMujeres + cantidadOtros;

            if(totalVisitantes <= 0) {
                return sendError(res, 400, "El total de visitantes debe ser mayor a cero.");
            }

            const newVisitante = await visitanteRepository.create({nombre, edad, cp, estado, pais, cantidadHombres, cantidadMujeres, cantidadOtros, totalVisitantes, museoId, usuarioId});
            
            if(!newVisitante){
                return sendError(res, 500, "No se pudo crear el visitante.");
            }
            
            return sendSuccess(res, 201, "Visitante creado correctamente.", newVisitante);
        } catch(error) {
            return sendError(res, 500, `Error al crear visitante. ${error.message}`);
        }
    }

    static async updateVisitante(req, res) {
        try {
            const { id } = req.params;
            const { 
                nombre,
                edad,
                cp,
                estado,
                pais,
                cantidadHombres,
                cantidadMujeres,
                cantidadOtros,
            } = req.body;

            const totalVisitantes = cantidadHombres + cantidadMujeres + cantidadOtros;

            if(totalVisitantes <= 0) {
                return sendError(res, 400, "El total de visitantes debe ser mayor a cero.");
            }

            const updated = await visitanteRepository.update({id}, {nombre, edad, cp, estado, pais, cantidadHombres, cantidadMujeres, cantidadOtros, totalVisitantes});

            if(!updated){
                return sendError(res, 404, "Visitante no encontrado o no se pudo actualizar.");
            }

            return sendSuccess(res, 200, "Visitante actualizado correctamente.", updated);
        } catch(error) {
            return sendError(res, 500, `Error al actualizar visitante. ${error.message}`);
        }
    }
}