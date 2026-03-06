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
            allowNull: false,
            validate: {
                is: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]+$/, 
            }
        },
        ubicacion: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                is: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s.,;:#&"'()\-]+$/, 
                len: [10, 255]
            }
        }
    });

    return Museo;
 }