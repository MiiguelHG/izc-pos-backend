import { articuloRepository } from "../repositories/index.js";
import db from "#models/index.js"
const { articulo, boletoTipo } = db;

export const boletoSeeder = async () => {
  try {
    const [articulodb, created] = await articulo.findOrCreate({
      where: { nombre: "Entrada General" },
      defaults: {
        nombre: "Entrada General",
        descripcion: "Acceso general al museo",
        precioEstandar: 30.00,
        tipo: "boleto"
      }
    });
    
    if (created) {
      console.log('Artículo creado exitosamente');
    }

    const [boletoTipodb, boletoTipoCreated] = await boletoTipo.findOrCreate({
      where: { nombre: "Entrada general" },
      defaults: {
        nombre: "General",
        descripcion: "Boleto general para acceso al museo",
        descuento: 0,
        precioFinal: 30.00,
        esEspecial: false,
        dias: [0, 1, 2, 3, 4, 5, 6], // Todos los días de la semana
        articuloId: articulodb.id
      }
    });

    if (boletoTipoCreated) {
      console.log('Tipo de boleto creado exitosamente');
    }

  } catch (error) {
    console.error("Error al crear el articulo:", error.message);
  }
}