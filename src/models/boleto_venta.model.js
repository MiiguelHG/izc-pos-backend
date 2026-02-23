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
        boletoTipoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true
            }
        },
        boletoEmitidoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true
            }
        }
    });

    return BoletoVenta;
}