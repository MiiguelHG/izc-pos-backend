import { formaPagoRepository } from "#repositories/index.js";

export const formaPagoSeeder = async (nombre, descripcion) => {
    try {
        const formaPago = await formaPagoRepository.create({nombre, descripcion});
        console.log(`FormaPago creado con ID: ${formaPago.id}, Nombre: ${formaPago.nombre}`);
        return formaPago;
    } catch (error) {
        console.error('Error seeding formaPago:', error);
    }
};