import { usuarioRepository, museoUsuarioRepository} from "../repositories/index.js";

export const userSeeder = async (nombre, email, password, rolId, museosIds) => {
    try {
        const usuario = await usuarioRepository.create({nombre, email, password, rolId});

        const museosAsociados = await museoUsuarioRepository.createUserMuseo({museosIds, usuarioId: usuario.id});

        if (!museosAsociados) {
            console.log(`No se pudieron asociar museos al usuario con ID: ${usuario.id}`);
        }

        console.log(`Usuario creado: ${usuario.nombre} con ID: ${usuario.id}`); 
    } catch (error) {
        console.log(`Error creando usuario: ${error.message}`);
    }
}