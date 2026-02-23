import { DataTypes } from "sequelize";

export default (sequelize, Sequelize) => { 
    const Articulo = sequelize.define("articulos", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]+$/,
                len: [3, 255]
            }
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                is: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s.,;:!?"'()\-]+$/ // Solo letras, números, espacios y algunos signos de puntuación
            }
        },
        precioEstandar: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
            validate: {
                min: 0,
                isDecimal: true
            }
        },
        tipo: {
            type: DataTypes.ENUM('boleto' , 'producto', 'servicio'),
            allowNull: false,
            validate: {
                isIn: [['boleto', 'producto', 'servicio']]
            }
        }
    });

    return Articulo;
 }