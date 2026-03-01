import { informesRepository } from "#repositories/index.js";
import { sendSuccess, sendError } from "#utils/responseFormater.js";

export class InformesController {
  static async getVisitantesForInforme(req, res) {
    try {
        const { fechaInicio, fechaFin, museoId, genero, cp, municipio, estado, nacionalidad, edadMin, edadMax } = req.query;

        const visitantes = await informesRepository.findVisitantesToInforme({fechaInicio, fechaFin, museoId, genero, cp, municipio, estado, nacionalidad, edadMin, edadMax});

        if (visitantes.length === 0) {
            return sendError(res, 400, "No se encontraron visitantes para los criterios especificados.");
        }

        return sendSuccess(res, 200, "Visitantes obtenidos correctamente.", { count: visitantes.length, data: visitantes } );
    } catch(error) {
        return sendError(res, 500, `Error al obtener visitantes para informe. ${error.message}`);
    }
  }

  static async getIngresosForInforme(req, res) {
    try {
      const { fechaInicio, fechaFin, museoId,formaPagoId, tipo } = req.query;

      let ingresos;
      if (tipo === 'boletos') {
        ingresos = await informesRepository.findBoletosToInforme({fechaInicio, fechaFin, museoId, formaPagoId});
      } else if (tipo === 'productos') {
        ingresos = await informesRepository.findProductosToInforme({fechaInicio, fechaFin, museoId, formaPagoId});
      } else if (tipo === 'eventos') {
        ingresos = await informesRepository.findEventosToInforme({fechaInicio, fechaFin, museoId, formaPagoId});
      } else {
        ingresos = await informesRepository.findAllIngresosToInforme({fechaInicio, fechaFin, museoId, formaPagoId});
      }
      
      if (ingresos.length === 0) {
        return sendError(res, 400, "No se encontraron ingresos para los criterios especificados.");
      }

      return sendSuccess(res, 200, "Ingresos obtenidos correctamente.", { count: ingresos.length, data: ingresos } );
    } catch (error) {
      return sendError(res, 500, `Error al obtener ingresos para informe. ${error.message}`);
    }
  }
}