import { usuarioRepository, museoRepository} from "../repositories/index.js";

export const userSeeder = async (nombre, email, password, rolId, museosIds) => {
    try {
        const usuario = await usuarioRepository.create({nombre, email, password, rolId});

        const museosAsociados = await museoRepository.createUserMuseo(museosIds, usuario.id);

        console.log(`Usuario creado: ${usuario.nombre} con ID: ${usuario.id}`); 
    } catch (error) {
        console.log(`Error creando usuario: ${error}`)
    }
}