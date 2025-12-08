import { DipomexRepository } from "#repositories/index.js";
import { sendError, sendSuccess } from "#utils/responseFormater.js";

export class DipomexController {
  static async getEstados(req, res) {
    try {
      const estados = await DipomexRepository.getEstados();
      
      return sendSuccess(res, 200, "Estados obtenidos exitosamente", estados);
    } catch (error) {
      return sendError(res, 500, `Error al obtener estados: ${error}`);
    }
  }

  static async getByCodigoPostal(req, res) {
    try {
      const { cp } = req.params;
      const codigoPostalInfo = await DipomexRepository.getByCodigoPostal(cp);
      
      return sendSuccess(res, 200, "Información del código postal obtenida exitosamente", codigoPostalInfo);
    } catch (error) {
      return sendError(res, 500, `Error al obtener información del código postal: ${error}`);
    }
  }
}