import { museoRepository } from "../repositories/index.js";
import db from "#models/index.js"
const { ubicacion, museo } = db;

export const museoSeeder = async () => {
    try {
        const [newUbicacion, created] = await ubicacion.findOrCreate({
            where: {
                calle: 'Dr. Ignacio Hierro',
                numero: 307,
                colonia: 'Zacatecas Centro',
                ciudad: 'Zacatecas',
                estado: 'Zacatecas',
                codigoPostal: 98000
            },
            defaults: {
                calle: 'Dr. Ignacio Hierro',
                numero: 307,
                colonia: 'Zacatecas Centro',
                ciudad: 'Zacatecas',
                estado: 'Zacatecas',
                codigoPostal: 98000
            }
        });

        if (created) {
            console.log('Ubicación creada exitosamente');
        }

        const [museodb, museoCreated] = await museo.findOrCreate({
            where: { nombre: 'El Zacatecano' },
            defaults: {
                nombre: 'El Zacatecano',
                ubicacionId: newUbicacion.id
            }
        });

        if (museoCreated) {
            console.log('Museo creado exitosamente');
        }

    } catch (error) {
        console.error(`Error creando museo: ${error}`);
    }
}