import { rolRepository } from "../repositories/index.js";

const roles = ['admin', 'user', 'moderator'];

export const rolSeeder = async () => {
    try {
        roles.forEach(async (nombre) => {
            await rolRepository.findOrCreateRole(nombre);
        })
    } catch (error) {
        console.log(`Error creating roles: ${error}`)
    }
}