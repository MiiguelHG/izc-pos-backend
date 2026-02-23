import { DataTypes } from "sequelize";

export default (sequelize, Sequelize) => {
    const Visitante = sequelize.define("visitantes", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                is: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]+$/,
                len: [3, 100]
            }
        },
        edad: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 120,
                isInt: true
            }
        },
        cp: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                isInt: true,
                min: 10000,
                max: 99999
            }
        },
        pais: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                is: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/,
                len: [2, 100]
            }
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                is: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/,
                len: [2, 100]
            }
        },
        municipio: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                is: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/,
                len: [2, 100]
            }
        },
        cantidadHombres: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                isInt: true
            }
        },
        cantidadMujeres: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                isInt: true
            }
        },
        cantidadOtros: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                isInt: true
            }
        },
        totalVisitantes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                isInt: true
            }
        },
        fechaRegistro: {
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
        }
    });

    return Visitante;
};