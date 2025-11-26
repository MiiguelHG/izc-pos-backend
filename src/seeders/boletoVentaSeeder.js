import { boletoVentaRepository } from "../repositories/index.js";

export const boletoVentaSeeder = async (cantidad, subTotal, boletoTipoId, boletoEmitidoId) => {
  try {
    const boletoVenta = await boletoVentaRepository.create({
      cantidad,
      subTotal,
      boletoTipoId,
      boletoEmitidoId
    });
    console.log(`Boleto venta creado con ID: ${boletoVenta.id}, Cantidad: ${boletoVenta.cantidad}, Subtotal: $${boletoVenta.subTotal}`);
    return boletoVenta;
  } catch (error) {
    console.error("Error al crear el boleto venta:", error.message);
  }
};
