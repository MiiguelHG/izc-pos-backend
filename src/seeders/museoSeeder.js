import { museoRepository } from "../repositories/index.js";

export const museoSeeder = async (nombre, ubicacion, descripcion) => {
    try {
        const museo = await museoRepository.create({nombre, ubicacion});
        console.log(`Museo creado: ${museo.nombre} con ID: ${museo.id}`);
    } catch (error) {
        console.log(`Error creando museo: ${error}`)
    }
}