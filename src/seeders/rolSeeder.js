import { rolRepository } from "../repositories/index.js";
import db from "#models/index.js"
const { rol } = db;

const roles = ['admin', 'directorMuseo', 'operador'];

export const rolSeeder = async () => {
    try {
        for (const item of roles) {
            const [createdRol, created] = await rol.findOrCreate({
                where: { nombre: item },
                defaults: { nombre: item }
            });
            if (created) {
                console.log(`Rol ${createdRol.nombre} creado exitosamente`);
            }
        }
    } catch (error) {
        console.log(`Error creating roles: ${error}`)
    }
}