import { productoVentaRepository } from "#repositories/index.js";

export const productoVentaSeeder = async (total, museoId, usuarioId, formaPagoId) => {
  try {
    const productoVenta = await productoVentaRepository.create({
        total,
        fechaVenta: new Date(),
        museoId,
        usuarioId,
        formaPagoId
    });
    console.log(`ProductoVenta creado con ID: ${productoVenta.id}, Total: $${productoVenta.total}`);
    return productoVenta;
  } catch (error) {
    console.error('Error seeding productoVenta:', error);
  }
};