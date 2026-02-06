import { boletoTipoRepository } from "../repositories/index.js";

export const boletoTipoSeeder = async (nombre, descripcion, descuento, precioFinal, articuloId, esEspecial) => {
  try {
    const boletoTipo = await boletoTipoRepository.create({
      nombre,
      descripcion,
      descuento,
      precioFinal,
      articuloId,
      esEspecial
    });
    console.log(`Tipo de boleto creado: ${boletoTipo.nombre} con ID: ${boletoTipo.id}`);
    return boletoTipo;
  } catch (error) {
    console.error("Error al crear el tipo de boleto:", error.message);
  }
};
