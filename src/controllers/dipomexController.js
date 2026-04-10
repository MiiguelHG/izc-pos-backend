import { DipomexRepository } from "#repositories/index.js";
import { sendError, sendSuccess } from "#utils/responseFormater.js";

export class DipomexController {
  static async getEstados(req, res) {
    try {
      const estados = await DipomexRepository.findAllEstados()
      
      return sendSuccess(res, 200, "Estados obtenidos exitosamente", estados);
    } catch (error) {
      return sendError(res, 500, `Error al obtener estados: ${error}`);
    }
  }

  static async getByCodigoPostal(req, res) {
    try {
      const { cp } = req.params;
      const codigoPostalInfo = await DipomexRepository.findByCodigoPostal(cp);
      
      return sendSuccess(res, 200, "Información del código postal obtenida exitosamente", codigoPostalInfo);
    } catch (error) {
      return sendError(res, 500, `Error al obtener información del código postal: ${error}`);
    }
  }

  static async getMunicipiosByEstadoId(req, res) {
    try {
      const { estadoId } = req.params;
      const municipios = await DipomexRepository.findMunicipiosByEstadoId(estadoId);

      if (!municipios || municipios.length === 0) {
        return sendError(res, 404, `No se encontraron municipios para el estadoId: ${estadoId}`);
      }
      return sendSuccess(res, 200, "Municipios obtenidos exitosamente", municipios);
    } catch (error) {
      return sendError(res, 500, `Error al obtener municipios por estadoId: ${error}`);
    }
  }

  static async getPaises(req, res) {
    try {
      const paises = await DipomexRepository.findAllPaises();
      return sendSuccess(res, 200, "Países obtenidos exitosamente", paises);
    } catch (error) {
      return sendError(res, 500, `Error al obtener países: ${error}`);
    }
  }
}