import { sendSuccess, sendError } from "../utils/responseFormater.js";
import { boletoTipoRepository, articuloRepository } from "../repositories/index.js";

export class BoletoTipoController {
  static async createBoletoTipo(req, res) {
    try {
      const { nombre, descripcion, descuento, articuloId } = req.body;
      
      const articulo = await articuloRepository.findById(articuloId);

      if (!articulo) {
        return sendError(res, 404, "Articulo no encontrado");
      }

      const precioFinal = articulo.precioEstandar - (articulo.precioEstandar * (descuento / 100));

      const newBoletoTipo = await boletoTipoRepository.create({ nombre, descripcion, descuento, precioFinal, articuloId });

      if (!newBoletoTipo) {
        return sendError(res, 400, "No se pudo crear el tipo de boleto");
      }

      return sendSuccess(res, 201,"Tipo de boleto creado" , newBoletoTipo);

    } catch (error) {
      return sendError(res, 500, `Error interno del servidor: ${error.message}`);
    }
    
  }

  static async getBoletosTipos(req, res) {
    try {
      const boletosTipos = await boletoTipoRepository.findAll();

      if (!boletosTipos || boletosTipos.length === 0) {
        return sendError(res, 404, "No se encontraron tipos de boleto");
      }

      return sendSuccess(res, 200,"Boletos Tipos encontrados" , boletosTipos);
    } catch (error) {
      return sendError(res, 500, `Error interno del servidor: ${error.message}`);
    }
  }

  static async getBoletoTipoById(req, res) {
    try {
      const { id } = req.params;

      const boletoTipo = await boletoTipoRepository.findById(id);

      if (!boletoTipo) {
        return sendError(res, 404, "Tipo de boleto no encontrado");
      }

      return sendSuccess(res, 200,"Boleto Tipo encontrado" , boletoTipo);
    } catch (error) {
      return sendError(res, 500, `Error interno del servidor: ${error.message}`);
    }
  }

  static async boletoTipoUpdate(req, res) {
    try {
      const { id } = req.params;
      const { nombre, descripcion, descuento, articuloId } = req.body;

      const articulo = await articuloRepository.findById(articuloId);

      if (!articulo) {
        return sendError(res, 404, "Articulo no encontrado");
      }

      const precioFinal = articulo.precioEstandar - (articulo.precioEstandar * (descuento / 100));

      const updated = await boletoTipoRepository.update(
        { id },
        { nombre, descripcion, descuento, precioFinal, articuloId }
      );

      if (!updated) {
        return sendError(res, 400, "No se pudo actualizar el tipo de boleto");
      }

      return sendSuccess(res, 200,"Tipo de boleto actualizado" , updated);
    } catch (error) {
      
    }
  }

  static async boletoTipoDelete(req, res) {
    try {
      const { id } = req.params;

      const deleted = await boletoTipoRepository.delete({ id });

      if (!deleted) {
        return sendError(res, 400, "Tipo de boleto no encontrado o no se pudo eliminar");
      }

      return sendSuccess(res, 200,"Tipo de boleto eliminado" , deleted);
    } catch (error) {
      return sendError(res, 500, `Error interno del servidor: ${error.message}`);
    }
  }

  static async UpdateAllBoletosPrecioFinal(req, res) {
    try {
      const { articuloId, precioEstandar } = req.body;

      const updatedSuccess = await boletoTipoRepository.updatePrecioFinalByArticuloId({articuloId, precioEstandar});

      if (!updatedSuccess) {
        return sendError(res, 400, "No se pudieron actualizar los precios finales de los tipos de boleto");
      }

      return sendSuccess(res, 200,"Precios finales de boletos actualizados");
    } catch (error) {
      return sendError(res, 500, `Error interno del servidor: ${error.message}`);
    }
  }
}