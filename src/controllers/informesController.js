import { visitanteRepository } from "#repositories/index.js";
import { sendSuccess, sendError } from "#utils/responseFormater.js";

export class InformesController {
  static async getVisitantesForInforme(req, res) {
    try {
        const { fechaInicio, fechaFin, museoId, genero, cp, municipio, estado, nacionalidad, edadMin, edadMax } = req.query;

        const visitantes = await visitanteRepository.findVisitantesToInforme({fechaInicio, fechaFin, museoId, genero, cp, municipio, estado, nacionalidad, edadMin, edadMax});

        if (visitantes.length === 0) {
            return sendError(res, 400, "No se encontraron visitantes para los criterios especificados.");
        }

        return sendSuccess(res, 200, "Visitantes obtenidos correctamente.", { count: visitantes.length, data: visitantes } );
    } catch(error) {
        return sendError(res, 500, `Error al obtener visitantes para informe. ${error.message}`);
    }
  }
}