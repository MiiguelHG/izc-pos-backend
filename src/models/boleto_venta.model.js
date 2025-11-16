import { DataTypes } from "sequelize";

export default (sequelize, Sequelize) => {
    const BoletoVenta = sequelize.define("boleto_ventas", {
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
        boletoTipoId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        boletoEmitidoId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    return BoletoVenta;
}