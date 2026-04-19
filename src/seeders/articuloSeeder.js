import { articuloRepository } from "../repositories/index.js";
import db from "#models/index.js"
const { articulo } = db;

export const articuloSeeder = async () => {
  try {
    const [articulodb, created] = await articulo.findOrCreate({
      where: { nombre: "Entrada General" },
      defaults: {
        nombre: "Entrada General",
        descripcion: "Acceso general al museo",
        precio: 30.00,
        tipo: "boleto"
      }
    });
    
    if (created) {
      console.log('Artículo creado exitosamente');
    }
  } catch (error) {
    console.error("Error al crear el articulo:", error.message);
  }
}