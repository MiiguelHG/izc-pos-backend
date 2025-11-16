import { DataTypes } from "sequelize";

export default (sequelize, Sequelize) => {
    const FormaPago = sequelize.define("formas_pago", {
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
    });

    return FormaPago;
};