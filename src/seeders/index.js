import { rolSeeder } from "./rolSeeder.js";
import { userSeeder } from "./userSeeder.js";
import { museoSeeder } from "./museoSeeder.js";
import { articuloSeeder } from "./articuloSeeder.js";
import { boletoTipoSeeder } from "./boletoTipoSeeder.js";
import { formaPagoSeeder } from "./formaPagoSeeder.js";
import { museoHasArticuloSeeder } from "./museoHasArticuloSeeder.js";
import { dipomexSeeder } from "./dipomexSeeder.js";

export const runSeeders = async () => {
    try {
        console.log("Running initial seeders...")
        await rolSeeder();
        await dipomexSeeder();

        await museoSeeder("Museo Nacional", "Av. Hidalgo", 45, "Centro Histórico", "Zacatecas", "Zacatecas", 98000);
        await museoSeeder("Museo de Arte Moderno", "Calle Tacuba", 120, "Centro", "Guadalajara", "Jalisco", 44100);
        await museoSeeder("Museo de Historia", "Blvd. García de León", 510, "Chapultepec", "Morelia", "Michoacán", 58260);
        await museoSeeder("Museo Interactivo", "Av. Juárez", 87, "La Paz", "Puebla", "Puebla", 72160);
        await museoSeeder("Museo de Ciencias", "Calle Allende", 230, "Barrio de San Marcos", "Aguascalientes", "Aguascalientes", 20000);
        await museoSeeder("Museo de Antropología", "Paseo Montejo", 485, "Centro", "Mérida", "Yucatán", 97000);
        await museoSeeder("Museo de Arte Contemporáneo", "Av. Constitución", 350, "Zona Centro", "Monterrey", "Nuevo León", 64000);
        await museoSeeder("Museo del Ferrocarril", "Calle 11 Norte", 1005, "Centro", "Puebla", "Puebla", 72000);
        await museoSeeder("Museo Naval", "Av. Insurgentes", 74, "Centro", "Veracruz", "Veracruz", 91700);
        await museoSeeder("Museo de la Revolución", "Calle Lerdo", 6, "Centro Histórico", "Chihuahua", "Chihuahua", 31000);
        await museoSeeder("Museo del Juguete", "Av. López Mateos", 201, "Centro", "San Luis Potosí", "San Luis Potosí", 78000);
        await museoSeeder("Museo de la Ciudad", "Calle Macedonio Alcalá", 202, "Centro", "Oaxaca", "Oaxaca", 68000);
        await museoSeeder("Museo de Arte Sacro", "Dr. Hierro", 149, "Centro Histórico", "Zacatecas", "Zacatecas", 98000);

        await userSeeder("Jesus Miguel Hernandez Garcia", "miguel@example.com", "123456", 1, 1);
        await userSeeder("Alex Quiroz Saucedo", "alex@example.com", "123456", 2, 2);
        await userSeeder("Ana Sofia Sanchez Hernandez", "ana@example.com", "123456", 3, 2);
        await userSeeder("Sofía", "sofia@example.com", "123456", 3, 3);
        await userSeeder("Carlos", "carlos@example.com", "123456", 3, 4);

        await articuloSeeder("Entrada General", "Acceso general al museo", 100.00, "boleto"); // 1
        await articuloSeeder("Guía Audiovisual", "Dispositivo de guía audiovisual", 50.00, "producto"); // 2
        await articuloSeeder("Café", "Bebida caliente", 15.00, "producto"); // 3
        await articuloSeeder("Llavero", "Accesorio para llaves", 5.00, "producto"); // 4
        await articuloSeeder("Catálogo del Museo", "Libro con información del museo", 30.00, "producto"); // 5
        await articuloSeeder("Taza con Logo", "Taza con el logo del museo", 20.00, "producto"); // 6
        await articuloSeeder("Postal", "Postal con imagen del museo", 3.00, "producto"); // 7
        await articuloSeeder("Imán de Refrigerador", "Imán con diseño del museo", 4.00, "producto"); // 8
        await articuloSeeder("Camiseta del Museo", "Camiseta con el logo del museo", 25.00, "producto"); // 9
        await articuloSeeder("Taller de Pintura", "Taller práctico de pintura", 200.00, "servicio"); // 10
        await articuloSeeder("Visita Guiada", "Recorrido guiado por el museo", 150.00, "servicio"); // 11
        await articuloSeeder("Conferencia Especial", "Conferencia sobre arte y cultura", 120.00, "servicio"); // 12
        await articuloSeeder("Sesión de fotografías", "Sesión fotográfica en el museo", 1200.00, "servicio"); // 13
        await articuloSeeder("Presentación especial de culturas", "Presentación cultural", 800.00, "servicio"); // 14
        await articuloSeeder("Presentación especial de arte contemporáneo", "Presentación de arte", 800.00, "servicio"); // 15

        await museoHasArticuloSeeder(2, 1);
        await museoHasArticuloSeeder(2, 2);
        await museoHasArticuloSeeder(2, 3);
        await museoHasArticuloSeeder(2, 4);
        await museoHasArticuloSeeder(2, 5);
        await museoHasArticuloSeeder(2, 6);
        await museoHasArticuloSeeder(2, 7);
        await museoHasArticuloSeeder(1, 8);
        await museoHasArticuloSeeder(1, 9);
        await museoHasArticuloSeeder(2, 10);
        await museoHasArticuloSeeder(2, 11);
        await museoHasArticuloSeeder(2, 12);
        await museoHasArticuloSeeder(2, 13);
        await museoHasArticuloSeeder(1, 14);
        await museoHasArticuloSeeder(1, 15);


        await boletoTipoSeeder("Estandar", "Boleto estándar para adultos", 0, 100.00, [0,1,2,3,4,5,6], true, 1, false);
        await boletoTipoSeeder("Menor de edad", "Boleto para menores de edad", 50, 50.00, [0,1,2,3,4,5,6], true, 1, false);
        await boletoTipoSeeder("Mayor de edad", "Boleto para adultos", 50, 50.00, [0,1,2,3,4,5,6], false, 1, false);
        await boletoTipoSeeder("Estudiante", "Boleto con descuento para estudiantes", 30, 70.00, [1,2,3,4], true, 1, false);

        await formaPagoSeeder("Efectivo", "Pago en efectivo", true);
        await formaPagoSeeder("Tarjeta de crédito", "Pago con tarjeta de crédito", false);
        await formaPagoSeeder("Tarjeta de débito", "Pago con tarjeta de débito", true);


        console.log("\n✅ Todos los seeders se ejecutaron exitosamente");
    } catch (error) {
        console.log(`Error runing seeders: ${error}`)
    }
}