import { DataTypes } from "sequelize";

export default (sequelize, Sequelize) => {
    const ProductoDetalle = sequelize.define("producto_detalles", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                isInt: true
            }
        },
        subTotal: {
            type: DataTypes.DECIMAL(7, 2),
            allowNull: false,
            validate: {
                min: 0,
                isDecimal: true
            }
        },
        articuloId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true
            }
        },
        productoVentaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true
            }
        }
    });

    return ProductoDetalle;
}