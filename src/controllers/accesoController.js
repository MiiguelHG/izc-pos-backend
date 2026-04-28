import { AccesoRepository } from "#repositories/index.js";
import { sendError, sendSuccess } from "#utils/responseFormater.js";


export class AccesoController {
  static async controlAcceso (req, res) {
    try {
      const boletoEmitidoId = Number.parseInt(req.params.boletoEmitidoId, 10);
      // const { user } = req;
      // const museoId = Number.parseInt(user?.museoId, 10);

      if (!Number.isInteger(boletoEmitidoId) || boletoEmitidoId <= 0) {
        return sendError(res, 400, "El parametro boletoEmitidoId debe ser un entero mayor a 0.");
      }

      // if (!Number.isInteger(museoId) || museoId <= 0) {
      //   return sendError(res, 401, "Usuario sin museo asignado o token invalido.");
      // }

      const accesoValido = await AccesoRepository.validarAcceso({boletoEmitidoId});

      return sendSuccess(res, 200, "Acceso validado exitosamente.", accesoValido);
    } catch (error) {
      const statusCode = Number.isInteger(error?.status) ? error.status : 500;
      const message = statusCode >= 500
        ? "Error interno al validar acceso."
        : error.message;

      return sendError(res, statusCode, message);
      
    }
  }
}