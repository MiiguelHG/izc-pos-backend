import { rolSeeder } from "./rolSeeder.js";
import { userSeeder } from "./userSeeder.js";
import { museoSeeder } from "./museoSeeder.js";
import { articuloSeeder } from "./articuloSeeder.js";
import { boletoTipoSeeder } from "./boletoTipoSeeder.js";
import { boletoEmitidoSeeder } from "./boletoEmitidoSeeder.js";
import { boletoVentaSeeder } from "./boletoVentaSeeder.js";
import { productoVentaSeeder } from "./productoVentaSeeder.js";
import { productoDetalleSeeder } from "./productoDetalleSeeder.js";
import { formaPagoSeeder } from "./formaPagoSeeder.js";
import { visitanteSeeder } from "./visitanteSeeder.js";

export const runSeeders = async () => {
    try {
        console.log("Running initial seeders...")
        await rolSeeder();
        await museoSeeder("Museo Nacional", "Ciudad de México");
        await museoSeeder("Museo de Arte Moderno", "Ciudad de México");
        await museoSeeder("Museo de Historia", "Guadalajara");
        await museoSeeder("Museo Interactivo", "Monterrey");
        await museoSeeder("Museo de Ciencias", "Puebla");
        await museoSeeder("Museo de Antropología", "Ciudad de México");
        await museoSeeder("Museo de Arte Contemporáneo", "Tijuana");
        await museoSeeder("Museo del Ferrocarril", "Chihuahua");
        await museoSeeder("Museo Naval", "Veracruz");
        await museoSeeder("Museo de la Revolución", "Ciudad de México");
        await museoSeeder("Museo del Juguete", "Ciudad de México");
        await museoSeeder("Museo de la Ciudad", "Mérida");
        await museoSeeder("Museo de Arte Sacro", "Oaxaca");

        await userSeeder("Miguel", "miguel@example.com", "123456", 1, 1);
        await userSeeder("Alex", "alex@example.com", "123456", 2, 1);
        await userSeeder("Ana", "ana@example.com", "123456", 3, 2);

        await articuloSeeder("Entrada General", "Acceso general al museo", 100.00, "boleto");
        await articuloSeeder("Guía Audiovisual", "Dispositivo de guía audiovisual", 50.00, "producto");
        await articuloSeeder("Café", "Bebida caliente", 15.00, "producto");
        await articuloSeeder("Llavero", "Accesorio para llaves", 5.00, "producto");
        await articuloSeeder("Catálogo del Museo", "Libro con información del museo", 30.00, "producto");
        await articuloSeeder("Taza con Logo", "Taza con el logo del museo", 20.00, "producto");
        await articuloSeeder("Postal", "Postal con imagen del museo", 3.00, "producto");
        await articuloSeeder("Imán de Refrigerador", "Imán con diseño del museo", 4.00, "producto");
        await articuloSeeder("Camiseta del Museo", "Camiseta con el logo del museo", 25.00, "producto");
        await articuloSeeder("Taller de Pintura", "Taller práctico de pintura", 200.00, "servicio");
        await articuloSeeder("Visita Guiada", "Recorrido guiado por el museo", 150.00, "servicio");
            await articuloSeeder("Conferencia Especial", "Conferencia sobre arte y cultura", 120.00, "servicio");

        await boletoTipoSeeder("Estandar", "Boleto estándar para adultos", 0, 100.00, 1);
        await boletoTipoSeeder("Menor de edad", "Boleto para menores de edad", 50, 50.00, 1);
        await boletoTipoSeeder("Mayor de edad", "Boleto para adultos", 50, 100.00, 1);
        await boletoTipoSeeder("Estudiante", "Boleto con descuento para estudiantes", 30, 70.00, 1);

        await formaPagoSeeder("Efectivo", "Pago en efectivo");
        await formaPagoSeeder("Tarjeta de crédito", "Pago con tarjeta de crédito");

        await productoVentaSeeder(300.00, 1, 1, 1);
        await productoDetalleSeeder(1, 100.00, 1, 1);
        await productoDetalleSeeder(1, 200.00, 2, 1);

        await visitanteSeeder("Juan Pérez", 30, "12345", "México", "Ciudad de México", "Benito Juárez", 1, 0, 0, 1, 1, 2);


        console.log("\n✅ Todos los seeders se ejecutaron exitosamente");
    } catch (error) {
        console.log(`Error runing seeders: ${error}`)
    }
}