import { DataTypes } from "sequelize";

export default (sequelize, Sequelize) => { 
    const Articulo = sequelize.define("articulos", {
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
        precioEstandar: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false
        },
        tipo: {
            type: DataTypes.ENUM('boleto' , 'producto', 'servicio'),
        }
    });

    return Articulo;
 }