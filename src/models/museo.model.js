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
                len: [3, 100]
            }
        },
        ubicacionId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                isInt: true,
                min: 1
            }
        }
    });

    return Museo;
 };