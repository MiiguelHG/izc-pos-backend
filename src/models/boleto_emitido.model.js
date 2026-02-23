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
            allowNull: false,
            validate: {
                min: 0,
                isDecimal: true
            }
        },
        fechaEmision: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        estado: {
            type: DataTypes.ENUM('activo', 'usado', 'cancelado'),
            allowNull: false,
            defaultValue: 'activo',
            validate: {
                isIn: [['activo', 'usado', 'cancelado']]
            }
        },
        usuarioId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true
            }
        },
        museoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true
            }
        },
        visitanteId: {
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

    return BoletoEmitido;
};