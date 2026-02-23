import { DataTypes } from "sequelize";

export default (sequelize, Sequelize) => {
    const Rol = sequelize.define("roles", {
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
                is: /^[a-zA-Z\s]+$/i
            }
        },
    });

    return Rol;
};
