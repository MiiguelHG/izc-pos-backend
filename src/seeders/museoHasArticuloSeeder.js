import { museoHasArticuloRepository } from "../repositories/index.js";

export const museoHasArticuloSeeder = async (museoId, articuloId) => {
  try {
    const articulo = await museoHasArticuloRepository.create({museoId,articuloId});
    console.log(`Articulo agregado al museo con ID: ${museoId} el articulo con ID: ${articuloId}`);
  } catch (error) {
    console.error("Error al crear el articulo:", error.message);
  }
}