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

        // const totalVisitantes = await informesRepository.findTotalVisitantes({fechaInicio, fechaFin, museoId, genero, cp, municipio, estado, nacionalidad, edadMin, edadMax});

        // if (totalVisitantes.length === 0 || totalVisitantes[0].total === null) {
        //     return sendError(res, 400, "No se pudo calcular el total de visitantes para los criterios especificados.");
        // }

        // const maxMinVisitantes = await informesRepository.findMaxMinVisitantesFecha({fechaInicio, fechaFin, museoId, genero, cp, municipio, estado, nacionalidad, edadMin, edadMax});

        // if (!maxMinVisitantes) {
        //     return sendError(res, 400, "No se pudo calcular el máximo o mínimo de visitantes para los criterios especificados.");
        // }

        // const mediaVisitantes = visitantes.length > 0
        //   ? Math.round(Number(totalVisitantes[0].total || 0) / visitantes.length)
        //   : 0;

        const resumenVisitantes = await informesRepository.findResumenVisitantes({fechaInicio, fechaFin, museoId, genero, cp, municipio, estado, nacionalidad, edadMin, edadMax});

        if (!resumenVisitantes) {
          return sendError(res, 400, "No se pudo calcular el resumen de visitantes para los criterios especificados.");
        }

        return sendSuccess(res, 200, "Visitantes obtenidos correctamente.", { resumen: resumenVisitantes[0], data: visitantes } );
    } catch(error) {
        return sendError(res, 500, `Error al obtener visitantes para informe. ${error.message}`);
    }
  }

  static async getIngresosForInforme(req, res) {
    try {
      const { fechaInicio, fechaFin, museoId,formaPagoId, tipo } = req.query;

      let ingresos;
      if (!tipo) {
        ingresos = await informesRepository.findAllIngresosToInforme({fechaInicio, fechaFin, museoId, formaPagoId});
      } else {
        ingresos = await informesRepository.findIngresosByTipo({fechaInicio, fechaFin, museoId, formaPagoId, tipo});
      }
      
      if (ingresos.length === 0) {
        return sendError(res, 400, "No se encontraron ingresos para los criterios especificados.");
      }

      let resumenIngresos;
      if (!tipo) {
        resumenIngresos = await informesRepository.findResumenAllIngresos({fechaInicio, fechaFin, museoId, formaPagoId});
      } else {
        resumenIngresos = await informesRepository.findResumenIngresosByTipo({fechaInicio, fechaFin, museoId, formaPagoId, tipo});
      }

      if (!resumenIngresos || resumenIngresos.length === 0) {
        return sendError(res, 400, "No se pudo calcular el resumen de ingresos para los criterios especificados.");
      }

      return sendSuccess(res, 200, "Ingresos obtenidos correctamente.", { resumen: resumenIngresos[0], data: ingresos });
    } catch (error) {
      return sendError(res, 500, `Error al obtener ingresos para informe. ${error.message}`);
    }
  }
}