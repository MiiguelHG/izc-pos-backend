import { rolSeeder } from "./rolSeeder.js";
import { userSeeder } from "./userSeeder.js";
import { museoSeeder } from "./museoSeeder.js";
import { articuloSeeder } from "./articuloSeeder.js";

export const runSeeders = async () => {
    try {
        console.log("Running initial seeders...")
        await rolSeeder();
        await museoSeeder("Museo Nacional", "Ciudad de México", "El museo más grande de México");
        await museoSeeder("Museo de Arte Moderno", "Ciudad de México", "Museo dedicado al arte moderno");

        await userSeeder("miguel", "miguel@example.com", "password123", 1, [1, 2]);
        await articuloSeeder("Entrada General", "Acceso general al museo", 100.00, "boleto");
    } catch (error) {
        console.log(`Error runing seeders: ${error}`)
    }
}