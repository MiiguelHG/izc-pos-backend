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
        habilitado: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        dias: {
            type: DataTypes.JSON,
            allowNull: false,
            get() {
                const value = this.getDataValue('dias');
                return typeof value === 'string' ? JSON.parse(value) : value;
            },
            validate: {
                dontRepeat(value) {
                    const uniqueValues = new Set(value);
                    if (uniqueValues.size !== value.length) {
                        throw new Error("Los días no pueden repetirse");
                    }
                },
                isValidDayRange(value) {
                    if (!Array.isArray(value) || !value.every(day => Number.isInteger(day) && day >= 0 && day <= 6)) {
                        throw new Error("Los días deben ser valores entre 0 y 6");
                    }
                }
            }
        },
        articuloId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    return BoletoTipo;
}