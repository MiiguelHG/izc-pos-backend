import { formaPagoRepository } from "../repositories/index.js";
import { sendError, sendSuccess } from "../utils/responseFormater.js";

export class FormaPagoController {
    static async createFormaPago(req, res) {
        try {
            const { nombre, descripcion } = req.body;
            const newFormaPago = await formaPagoRepository.create({ nombre, descripcion });
            return sendSuccess(res, 201, "Forma de pago creada exitosamente.", newFormaPago);
        } catch (error) {
            return sendError(res, 500, `Error al crear forma de pago: ${error.message}`);
        }
    }

    static async getFormasPago(req, res) {
        try {
            const formasPago = await formaPagoRepository.findAll();
            return sendSuccess(res, 200, "Formas de pago recuperadas exitosamente.", formasPago);
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
                return sendError(res, 404, "Forma de pago no encontrada.");
            }
            return sendSuccess(res, 200, "Forma de pago actualizada exitosamente.", nombre, descripcion);
        } catch (error) {
            return sendError(res, 500, `Error al actualizar forma de pago: ${error.message}`);
        }
    }

    static async deleteFormaPago(req, res) {
        try {
            const deleted = await formaPagoRepository.delete({id: req.params.id});
            if (!deleted) {
                return sendError(res, 404, "Forma de pago no encontrada.");
            }
            return sendSuccess(res, 200, "Forma de pago eliminada exitosamente.");
        } catch (error) {
            return sendError(res, 500, `Error al eliminar forma de pago: ${error.message}`);
        }
    }
}