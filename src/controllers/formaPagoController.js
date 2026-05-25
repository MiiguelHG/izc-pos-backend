import { formaPagoRepository } from "../repositories/index.js";
import { sendError, sendSuccess } from "../utils/responseFormater.js";

export class FormaPagoController {
    static async createFormaPago(req, res) {
        try {
            const { nombre, descripcion } = req.body;
            const newFormaPago = await formaPagoRepository.create({ nombre, descripcion });
            if(!newFormaPago) {
                return sendError(res, 400, "No se pudo crear la forma de pago");
            }
            return sendSuccess(res, 201, "Forma de pago creada exitosamente", newFormaPago);
        } catch (error) {
            return sendError(res, 500, `Error al crear forma de pago: ${error.message}`);
        }
    }

    static async getFormasPago(req, res) {
        try {
            const { user } = req;

            const isAdmin = user.rol.nombre === 'admin' ? true : false; // Si es admin, no filtramos por activo
            const formasPago = await formaPagoRepository.findFormasPago({isAdmin});
            if(!formasPago) {
                return sendError(res, 404, "No se encontraron formas de pago");
            }
            return sendSuccess(res, 200, "Formas de pago recuperadas exitosamente", formasPago);
        } catch (error) {
            return sendError(res, 500, `Error al obtener formas de pago: ${error.message}`);
        }
    }

    static async updateFormaPago(req, res) {
        try {
            const {nombre, descripcion} = req.body;
            const updatedFormaPago = await formaPagoRepository.update(
                {id: req.params.id}, 
                {nombre, descripcion}
            );
            if (!updatedFormaPago) {
                return sendError(res, 404, "Forma de pago no encontrada");
            }
            return sendSuccess(res, 200, "Forma de pago actualizada exitosamente", updatedFormaPago);
        } catch (error) {
            return sendError(res, 500, `Error al actualizar forma de pago: ${error.message}`);
        }
    }

    static async toggleActivo(req, res) {
        try {
            const { id } = req.params;
            const formaPago = await formaPagoRepository.findById(id);
            if (!formaPago) {
                return sendError(res, 404, "Forma de pago no encontrada.");
            }

            const nuevoEstado = !formaPago.activo;

            const updatedFormaPago = await formaPagoRepository.update(
                { id },
                { activo: nuevoEstado }
            );
            return sendSuccess(res, 200, `Forma de pago ${nuevoEstado ? 'habilitada' : 'deshabilitada'} exitosamente`, updatedFormaPago);
        } catch (error) {
            return sendError(res, 500, `Error al actualizar estado de forma de pago: ${error.message}`);
        }
    }
}