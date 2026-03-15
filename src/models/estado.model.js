import { DataTypes } from "sequelize";

export default (sequelize, Sequelize) => {
  const Estado = sequelize.define("estados", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    }
  });

  return Estado;
}