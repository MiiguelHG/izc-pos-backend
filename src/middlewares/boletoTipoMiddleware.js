import { boletoTipoRepository } from "#repositories/index.js";
import { sendError } from "#utils/responseFormater.js";

export class BoletoTipoValidationMiddleware {
  static async verifyDiaVenta(req, res, next) {
    try {
      const { carritoBoletos } = req.body;
      const today = new Date();
      const todayDay = today.getDay();

      for (const item of carritoBoletos) {
        const boletoTipo = await boletoTipoRepository.findById(item.boletoTipoId);
        if (!boletoTipo) {
          return sendError(res, 404, `Tipo de boleto con ID ${item.boletoTipoId} no encontrado`);
        }
        if (!boletoTipo.dias.includes(todayDay)) {
          return sendError(res, 400, `El boleto '${boletoTipo.nombre}' no está disponible para la venta hoy`);
        }
        if (!boletoTipo.habilitado) {
          return sendError(res, 400, `El boleto '${boletoTipo.nombre}' no está habilitado para la venta`);
        }
      }

      next();
    } catch (error) {
      return sendError(res, 500, `Error interno del servidor: ${error.message}`);
    }
  }
}