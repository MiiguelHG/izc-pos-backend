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
            allowNull: false
        },
        fechaVenta: {
            type: DataTypes.DATE,
            allowNull: false, 
            defaultValue: DataTypes.NOW
        },
        museoId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        usuarioId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        formaPagoId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    return ProductoVenta;
}