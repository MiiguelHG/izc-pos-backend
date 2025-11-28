import { productoDetalleRepository } from "#repositories/index.js";

export const productoDetalleSeeder = async (cantidad, subTotal, articuloId, productoVentaId) => {
    try {
        const productoDetalle = await productoDetalleRepository.create({
            cantidad,
            subTotal,
            articuloId,
            productoVentaId
        });
        console.log(`ProductoDetalle creado con ID: ${productoDetalle.id}, cantidad: ${productoDetalle.cantidad}, SubTotal: $${productoDetalle.subTotal}`);
        return productoDetalle;
    } catch (error) {
        console.error('Error seeding productoDetalle:', error);
    }
};