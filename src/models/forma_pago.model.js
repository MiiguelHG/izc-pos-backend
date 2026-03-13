import { DataTypes } from "sequelize";

export default (sequelize, Sequelize) => {
    const FormaPago = sequelize.define("formas_pago", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]+$/, // Solo letras, números y espacios
                len: [3, 255] // Longitud entre 1 y 255 caracteres
            }
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                is: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s.,;:!?"'()\-]+$/ // Solo letras, números, espacios y algunos signos de puntuación
            }
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    });

    return FormaPago;
};