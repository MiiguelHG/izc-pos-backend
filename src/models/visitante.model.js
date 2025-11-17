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
        },
        edad: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        cp: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: false
        },
        pais: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cantidadHombres: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        cantidadMujeres: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        cantidadOtros: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        totalVisitantes: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fechaRegistro: {
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
        }
    });

    return Visitante;
};