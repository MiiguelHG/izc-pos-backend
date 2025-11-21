import { articuloRepository } from "../repositories/index.js";

export const articuloSeeder = async (nombre, descripcion, precioEstandar, tipo) => {
  try {
    const articulo = await articuloRepository.create({nombre,descripcion,precioEstandar,tipo});
    console.log(`Articulo creado: ${articulo.nombre} con ID: ${articulo.id}`);
  } catch (error) {
    console.error("Error al crear el articulo:", error.message);
  }
}