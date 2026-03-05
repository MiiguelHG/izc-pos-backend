import { informesRepository } from "#repositories/index.js";
import { sendSuccess, sendError } from "#utils/responseFormater.js";
import { rellenarFechasFaltantes, calcularPromedio } from "#utils/informeUtil.js";

export class InformesController {
  static async getVisitantesForInforme(req, res) {
    try {
        const { fechaInicio, fechaFin, museoId, genero, cp, municipio, estado, nacionalidad, edadMin, edadMax } = req.query;

        const visitantes = await informesRepository.findVisitantesToInforme({fechaInicio, fechaFin, museoId, genero, cp, municipio, estado, nacionalidad, edadMin, edadMax});

        if (visitantes.length === 0) {
            return sendError(res, 400, "No se encontraron visitantes para los criterios especificados.");
        }

        const [visitantesRellenados, countDiasCero] = rellenarFechasFaltantes(visitantes);

        const resumenVisitantes = await informesRepository.findResumenVisitantes({fechaInicio, fechaFin, museoId, genero, cp, municipio, estado, nacionalidad, edadMin, edadMax});

        if (!resumenVisitantes) {
          return sendError(res, 400, "No se pudo calcular el resumen de visitantes para los criterios especificados.");
        }

        resumenVisitantes[0].promedio = calcularPromedio(resumenVisitantes[0].total, visitantesRellenados.length);
        resumenVisitantes[0].diasCero = countDiasCero;

        return sendSuccess(res, 200, "Visitantes obtenidos correctamente.", { resumen: resumenVisitantes[0], data: visitantesRellenados } );
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

      const [ingresosRellenados, countDiasCero] = rellenarFechasFaltantes(ingresos);

      let resumenIngresos;
      if (!tipo) {
        resumenIngresos = await informesRepository.findResumenAllIngresos({fechaInicio, fechaFin, museoId, formaPagoId});
      } else {
        resumenIngresos = await informesRepository.findResumenIngresosByTipo({fechaInicio, fechaFin, museoId, formaPagoId, tipo});
      }

      if (!resumenIngresos || resumenIngresos.length === 0) {
        return sendError(res, 400, "No se pudo calcular el resumen de ingresos para los criterios especificados.");
      }

        resumenIngresos[0].promedio = calcularPromedio(resumenIngresos[0].total, ingresosRellenados.length);
        resumenIngresos[0].diasCero = countDiasCero;

      return sendSuccess(res, 200, "Ingresos obtenidos correctamente.", { resumen: resumenIngresos[0], data: ingresosRellenados });
    } catch (error) {
      return sendError(res, 500, `Error al obtener ingresos para informe. ${error.message}`);
    }
  }
}