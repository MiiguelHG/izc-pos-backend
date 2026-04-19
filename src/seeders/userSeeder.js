import { usuarioRepository} from "../repositories/index.js";
import db from "#models/index.js"
const { usuario, rol, museo } = db;

export const userSeeder = async () => {
    try {
        const roldb = await rol.findOne({ where: { nombre: "admin" } });
        if (!roldb) {
            console.error('Rol "admin" no encontrado. Asegúrate de ejecutar el rolSeeder antes de este seeder.');
            return;
        }

        const museodb = await museo.findOne({ where: { nombre: "El Zacatecano" } });

        if (!museodb) {
            console.error('Museo "El Zacatecano" no encontrado. Asegúrate de ejecutar el museoSeeder antes de este seeder.');
            return;
        }

        const [user, created] = await usuario.findOrCreate({
            where: { email: process.env.DEFAULT_USER_EMAIL },
            defaults: {
                nombre: process.env.DEFAULT_USER_NAME,
                email: process.env.DEFAULT_USER_EMAIL,
                password: process.env.DEFAULT_USER_PASSWORD,
                rolId: roldb.id,
                museoId: museodb.id
            }
        });

        if (created) {
            console.log('Usuario creado exitosamente');
        }
    } catch (error) {
        console.log(`Error creando usuario: ${error.message}`);
    }
}