import { DataTypes } from "sequelize";

export default (sequelize, Sequelize) => {
    const ProductoVenta = sequelize.define("producto_ventas", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0,
                isDecimal: true
            }
        },
        fechaVenta: {
            type: DataTypes.DATE,
            allowNull: false, 
            defaultValue: DataTypes.NOW
        },
        museoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true
            }
        },
        usuarioId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true
            }
        },
        formaPagoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true
            }
        }
    });

    return ProductoVenta;
}