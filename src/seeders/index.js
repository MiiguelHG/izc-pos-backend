import { rolSeeder } from "./rolSeeder.js";
import { userSeeder } from "./userSeeder.js";
import { museoSeeder } from "./museoSeeder.js";
import { articuloSeeder } from "./articuloSeeder.js";
import { boletoTipoSeeder } from "./boletoTipoSeeder.js";
import { boletoEmitidoSeeder } from "./boletoEmitidoSeeder.js";
import { boletoVentaSeeder } from "./boletoVentaSeeder.js";

export const runSeeders = async () => {
    try {
        console.log("Running initial seeders...")
        await rolSeeder();
        await museoSeeder("Museo Nacional", "Ciudad de México", "El museo más grande de México");
        await museoSeeder("Museo de Arte Moderno", "Ciudad de México", "Museo dedicado al arte moderno");

        await userSeeder("miguel", "miguel@example.com", "password123", 1, [1, 2]);
        await userSeeder("ana", "ana@example.com", "password123", 2, [2]);

        await articuloSeeder("Entrada General", "Acceso general al museo", 100.00, "boleto");

        // Crear tipos de boleto
        console.log("\n--- Creando tipos de boleto ---");
        await boletoTipoSeeder("Entrada General", "Acceso completo al museo", 0.00, 100.00, 1);
        await boletoTipoSeeder("Entrada Estudiante", "Descuento para estudiantes con credencial", 50.00, 50.00, 1);
        await boletoTipoSeeder("Entrada INAPAM", "Descuento para adultos mayores", 100.00, 0.00, 1);

        // Crear visitantes (necesarios por restricciones de clave foránea)
        console.log("\n--- Creando visitantes ---");
        const { visitanteRepository } = await import("../repositories/index.js");
        const visitante1 = await visitanteRepository.create({ 
            nombre: "Juan Pérez", 
            cp: 98000, 
            estado: "Zacatecas", 
            pais: "México", 
            totalVisitantes: 1, 
            museoId: 1, 
            usuarioId: 1 
        });
        const visitante2 = await visitanteRepository.create({ 
            nombre: "María García", 
            cp: 98010, 
            estado: "Zacatecas", 
            pais: "México", 
            totalVisitantes: 2, 
            museoId: 1, 
            usuarioId: 1 
        });
        const visitante3 = await visitanteRepository.create({ 
            nombre: "Carlos López", 
            cp: 98020, 
            estado: "Aguascalientes", 
            pais: "México", 
            totalVisitantes: 1, 
            museoId: 2, 
            usuarioId: 2 
        });
        const visitante4 = await visitanteRepository.create({ 
            nombre: "Ana Martínez", 
            cp: 98030, 
            estado: "Zacatecas", 
            pais: "México", 
            totalVisitantes: 3, 
            museoId: 2, 
            usuarioId: 2 
        });
        const visitante5 = await visitanteRepository.create({ 
            nombre: "Pedro Ramírez", 
            cp: 44100, 
            estado: "Jalisco", 
            pais: "México", 
            totalVisitantes: 1, 
            museoId: 1, 
            usuarioId: 1 
        });

        // Crear formas de pago (necesarias por restricciones de clave foránea)
        console.log("\n--- Creando formas de pago ---");
        const { formaPagoRepository } = await import("../repositories/index.js");
        const formaPago1 = await formaPagoRepository.create({ nombre: "Efectivo" });
        const formaPago2 = await formaPagoRepository.create({ nombre: "Tarjeta de Crédito" });
        const formaPago3 = await formaPagoRepository.create({ nombre: "Transferencia" });

        // Crear 14 boletos emitidos con sus respectivos boletos venta
        console.log("\n--- Creando boletos emitidos y ventas ---");
        
        // Boleto 1 - 1 tipo de boleto
        const boleto1 = await boletoEmitidoSeeder(100.00, 1, 1, visitante1.id, formaPago1.id);
        await boletoVentaSeeder(1, 100.00, 1, boleto1.id);

        // Boleto 2 - 2 tipos de boleto
        const boleto2 = await boletoEmitidoSeeder(150.00, 1, 1, visitante2.id, formaPago2.id);
        await boletoVentaSeeder(1, 100.00, 1, boleto2.id);
        await boletoVentaSeeder(1, 50.00, 2, boleto2.id);

        // Boleto 3 - 3 tipos de boleto
        const boleto3 = await boletoEmitidoSeeder(300.00, 2, 2, visitante3.id, formaPago1.id);
        await boletoVentaSeeder(2, 200.00, 1, boleto3.id);
        await boletoVentaSeeder(1, 50.00, 2, boleto3.id);
        await boletoVentaSeeder(1, 50.00, 2, boleto3.id);

        // Boleto 4 - 1 tipo de boleto
        const boleto4 = await boletoEmitidoSeeder(50.00, 2, 2, visitante4.id, formaPago3.id);
        await boletoVentaSeeder(1, 50.00, 2, boleto4.id);

        // Boleto 5 - 2 tipos de boleto
        const boleto5 = await boletoEmitidoSeeder(100.00, 1, 1, visitante5.id, formaPago1.id);
        await boletoVentaSeeder(1, 50.00, 2, boleto5.id);
        await boletoVentaSeeder(1, 50.00, 2, boleto5.id);

        // Boleto 6 - 3 tipos de boleto
        const boleto6 = await boletoEmitidoSeeder(200.00, 1, 1, visitante1.id, formaPago2.id, 'usado');
        await boletoVentaSeeder(1, 100.00, 1, boleto6.id);
        await boletoVentaSeeder(1, 50.00, 2, boleto6.id);
        await boletoVentaSeeder(1, 50.00, 2, boleto6.id);

        // Boleto 7 - 1 tipo de boleto
        const boleto7 = await boletoEmitidoSeeder(0.00, 2, 2, visitante2.id, formaPago1.id);
        await boletoVentaSeeder(1, 0.00, 3, boleto7.id);

        // Boleto 8 - 2 tipos de boleto
        const boleto8 = await boletoEmitidoSeeder(150.00, 1, 1, visitante3.id, formaPago3.id);
        await boletoVentaSeeder(1, 100.00, 1, boleto8.id);
        await boletoVentaSeeder(1, 50.00, 2, boleto8.id);

        // Boleto 9 - 3 tipos de boleto
        const boleto9 = await boletoEmitidoSeeder(250.00, 2, 2, visitante4.id, formaPago2.id);
        await boletoVentaSeeder(1, 100.00, 1, boleto9.id);
        await boletoVentaSeeder(2, 100.00, 2, boleto9.id);
        await boletoVentaSeeder(1, 50.00, 2, boleto9.id);

        // Boleto 10 - 1 tipo de boleto
        const boleto10 = await boletoEmitidoSeeder(100.00, 1, 1, visitante5.id, formaPago1.id, 'cancelado');
        await boletoVentaSeeder(1, 100.00, 1, boleto10.id);

        // Boleto 11 - 2 tipos de boleto
        const boleto11 = await boletoEmitidoSeeder(200.00, 2, 2, visitante1.id, formaPago2.id);
        await boletoVentaSeeder(2, 200.00, 1, boleto11.id);

        // Boleto 12 - 3 tipos de boleto
        const boleto12 = await boletoEmitidoSeeder(300.00, 1, 1, visitante2.id, formaPago3.id);
        await boletoVentaSeeder(2, 200.00, 1, boleto12.id);
        await boletoVentaSeeder(1, 50.00, 2, boleto12.id);
        await boletoVentaSeeder(1, 50.00, 2, boleto12.id);

        // Boleto 13 - 1 tipo de boleto
        const boleto13 = await boletoEmitidoSeeder(50.00, 2, 2, visitante3.id, formaPago1.id);
        await boletoVentaSeeder(1, 50.00, 2, boleto13.id);

        // Boleto 14 - 2 tipos de boleto
        const boleto14 = await boletoEmitidoSeeder(150.00, 1, 1, visitante4.id, formaPago2.id, 'usado');
        await boletoVentaSeeder(1, 100.00, 1, boleto14.id);
        await boletoVentaSeeder(1, 50.00, 2, boleto14.id);

        console.log("\n✅ Todos los seeders se ejecutaron exitosamente");
    } catch (error) {
        console.log(`Error runing seeders: ${error}`)
    }
}