import { DataTypes } from "sequelize";

export default (sequelize, Sequelize) => {
    const BoletoTipo = sequelize.define("boleto_tipos", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: true
        },
        descuento: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false
        },
        precioFinal: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false
        },
        esEspecial: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        articuloId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    return BoletoTipo;
}