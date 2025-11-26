import { usuarioRepository} from "../repositories/index.js";

export const userSeeder = async (nombre, email, password, rolId, museoId) => {
    try {
        const usuario = await usuarioRepository.create({nombre, email, password, rolId, museoId});
        console.log(`Usuario creado: ${usuario.nombre} con ID: ${usuario.id}`); 
    } catch (error) {
        console.log(`Error creando usuario: ${error.message}`);
    }
}