import { museoRepository } from "../repositories/index.js";
import db from "#models/index.js"
const { ubicacion } = db;

export const museoSeeder = async (nombre, calle, numero, colonia, ciudad, estado, codigoPostal) => {
    try {
        const newUbicacion = await ubicacion.create({
            calle,
            numero,
            colonia,
            ciudad,
            estado,
            codigoPostal
        });

        const museo = await museoRepository.create({nombre, ubicacionId: newUbicacion.id});
        console.log(`Museo creado: ${museo.nombre} con ID: ${museo.id}`);
    } catch (error) {
        console.error(`Error creando museo: ${error}`);
    }
}