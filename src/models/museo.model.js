import { DataTypes } from "sequelize";

export default (sequelize, Sequelize) => { 
    const Museo = sequelize.define("museos", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ubicacion: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });

    return Museo;
 }