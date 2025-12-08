import { visitanteRepository } from "#repositories/index.js";

export const visitanteSeeder = async (nombre, edad, cp, pais, estado, municipio, cantidadHombres, cantidadMujeres, cantidadOtros, totalVisitantes, museoId, usuarioId) => {
  try {
    const visitante = await visitanteRepository.create({
      nombre,
      edad,
      cp,
      pais,
      estado,
      municipio,
      cantidadHombres,
      cantidadMujeres,
      cantidadOtros,
      totalVisitantes,
      museoId,
      usuarioId
    });

    console.log(`Visitante creado: ${visitante.nombre} con ID: ${visitante.id}`);
  } catch (error) {
    console.log(`Error al crear visitante: ${error.message}`);
  }
}