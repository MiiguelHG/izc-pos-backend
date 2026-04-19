import { rolSeeder } from "./rolSeeder.js";
import { userSeeder } from "./userSeeder.js";
import { museoSeeder } from "./museoSeeder.js";
import { boletoSeeder } from "./boletoSeeder.js";
import { dipomexSeeder } from "./dipomexSeeder.js";

export const runSeeders = async () => {
    try {
        console.log("Running initial seeders...")
        await dipomexSeeder();
        await rolSeeder();
        await museoSeeder();
        await userSeeder();
        await boletoSeeder(); 


        console.log("\n✅ Todos los seeders se ejecutaron exitosamente");
    } catch (error) {
        console.log(`Error runing seeders: ${error}`)
    }
}