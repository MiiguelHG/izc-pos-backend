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
            allowNull: false
        },
        subTotal: {
            type: DataTypes.DECIMAL(7, 2),
            allowNull: false
        },
        articuloId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        productoVentaId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    return ProductoDetalle;
}