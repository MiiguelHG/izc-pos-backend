import { DataTypes } from "sequelize";

export default (sequelize, Sequelize) => {
    const BoletoEmitido = sequelize.define("boletos_emitidos", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        total: {
            type: DataTypes.DECIMAL(7, 2),
            allowNull: false
        },
        fechaEmision: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        estado: {
            type: DataTypes.ENUM('activo', 'usado', 'cancelado'),
            allowNull: false,
            defaultValue: 'activo'
        },
        usuarioId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        museoId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        visitanteId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        formaPagoId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    return BoletoEmitido;
};