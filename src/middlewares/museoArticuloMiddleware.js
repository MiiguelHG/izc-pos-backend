import { museoRepository } from "#repositories/index.js";
import { sendSuccess, sendError } from "#utils/responseFormater.js";

export class MuseoValidationMiddleware {
    static async validateMuseoExists(req, res, next) {
        try {
            // Buscar id en params o en body para soportar rutas con nombres diferentes
            const museoId = req.params.id || req.params.museoId || req.body.museoId || req.body.museo;
            const museo = await museoRepository.findById(museoId);
            if (!museo) {
                return sendError(res, 404, "Museo no encontrado.");
            }
            next();
        } catch (error) {
            return sendError(res, 500, `Error al validar la existencia del museo: ${error.message}`);
        }
    }
}
