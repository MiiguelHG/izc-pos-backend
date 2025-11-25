import { boletoEmitidoRepository } from "../repositories/index.js";

export const boletoEmitidoSeeder = async (total, usuarioId, museoId, visitanteId, formaPagoId, estado = 'activo') => {
  try {
    const boletoEmitido = await boletoEmitidoRepository.create({
      total,
      usuarioId,
      museoId,
      visitanteId,
      formaPagoId,
      estado
    });
    console.log(`Boleto emitido creado con ID: ${boletoEmitido.id}, Total: $${boletoEmitido.total}`);
    return boletoEmitido;
  } catch (error) {
    console.error("Error al crear el boleto emitido:", error.message);
  }
};
