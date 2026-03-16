import { DataTypes } from "sequelize";

export default (sequelize, Sequelize) => {
  const Municipio = sequelize.define("municipios", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    estadoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true
      }
    }
  });
  return Municipio;
}