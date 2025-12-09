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

export const runSeeders = async () => {
    try {
        console.log("Running initial seeders...")
        await rolSeeder();
        await museoSeeder("Museo Nacional", "Ciudad de México", "El museo más grande de México");
        await museoSeeder("Museo de Arte Moderno", "Ciudad de México", "Museo dedicado al arte moderno");

        await userSeeder("miguel", "miguel@example.com", "password123", 1, 1);
        await userSeeder("ana", "ana@example.com", "123456", 3, 2);

        await articuloSeeder("Entrada General", "Acceso general al museo", 100.00, "boleto");
        await articuloSeeder("Guía Audiovisual", "Dispositivo de guía audiovisual", 50.00, "artículo");
        await articuloSeeder("Taller de Pintura", "Taller práctico de pintura", 200.00, "evento");

        await formaPagoSeeder("Efectivo", "Pago en efectivo");

        await productoVentaSeeder(300.00, 1, 1, 1);
        await productoDetalleSeeder(1, 100.00, 1, 1);
        await productoDetalleSeeder(1, 200.00, 2, 1);

        console.log("\n✅ Todos los seeders se ejecutaron exitosamente");
    } catch (error) {
        console.log(`Error runing seeders: ${error}`)
    }
}