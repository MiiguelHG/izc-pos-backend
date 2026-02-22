import { boletoEmitidoRepository, visitanteRepository, museoRepository } from "#repositories/index.js";
import { sendError, sendSuccess } from "#utils/responseFormater.js";

export class BoletoEmitidoController {
  static async createVentaBoletos (req, res) {
    try {
      const { 
        nombre, edad, cp, pais, estado, municipio, cantidadHombres, cantidadMujeres, cantidadOtros,
        total, carritoBoletos, usuarioId, museoId, formaPagoId 
      } = req.body;

      const nuevoBoletoEmitido = await boletoEmitidoRepository.createVentaBoletosCompleta({nombre, edad, cp, pais, estado, municipio, cantidadHombres, cantidadMujeres, cantidadOtros, total, carritoBoletos, usuarioId, museoId, formaPagoId});

      if (!nuevoBoletoEmitido) {
        return sendError(res, 500, "Error al crear la venta de boletos");
      }

      const visitante = await visitanteRepository.findById(nuevoBoletoEmitido.visitanteId);
      const museo = await museoRepository.findById(museoId);

      const boletoEmitido = { ...nuevoBoletoEmitido, visitante: { ...visitante.dataValues }, museo: { ...museo.dataValues } };

      return sendSuccess(res, 201, "Venta de boletos creada exitosamente", boletoEmitido);
    } catch (error) {
      return sendError(res, 500, `Error interno del servidor: ${error}`);
    }
  }

  static async getBoletoEmitidoById (req, res) {
    try {
      const { id } = req.params;
      const boletoEmitido = await boletoEmitidoRepository.findByIdWithChildren({id});

      if (!boletoEmitido) {
        return sendError(res, 404, "Boleto emitido no encontrado");
      }

      return sendSuccess(res, 200, "Boleto emitido encontrado", boletoEmitido);
    } catch (error) {
      return sendError(res, 500, `Error interno del servidor: ${error.message}`);
    }
  }

  static async getAllBoletosEmitidos (req, res) {
    try {
      const limit = 10;

      const page = parseInt(req.query.page) || 1;
      const offset = (page - 1) * limit;

      const { user } = req;

      const museoId = user.rol?.nombre === 'admin' ? null : user.museo.id;

      const { rows, count } = await boletoEmitidoRepository.findAllAndCount({ limit, offset, museoId });

      if (count === 0) {
        return sendError(res, 404, "No se encontraron boletos emitidos");
      }

      const totalPages = Math.ceil(count / limit);

      return sendSuccess(res, 200, "Boletos emitidos encontrados", { 
        data: rows,
        meta: {
          totalItems: count,
          currentPage: page,
          totalPages: totalPages,
          pageSize: limit
        }
       });
    } catch (error) {
      return sendError(res, 500, `Error interno del servidor: ${error.message}`);
    }
  }

  static async updateBoletoEmitidoEstado (req, res) {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      const updated = await boletoEmitidoRepository.update({ id }, { estado });

      if (!updated) {
        return sendError(res, 500, "Error al actualizar el estado del boleto emitido");
      }
      return sendSuccess(res, 200, "Estado del boleto emitido actualizado exitosamente");
    } catch (error) {
      return sendError(res, 500, `Error interno del servidor: ${error.message}`);
    }
  }

}