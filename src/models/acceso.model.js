import { DataTypes } from "sequelize";

export default (sequelize, Sequelize) => {
  const Acceso = sequelize.define("accesos", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fechaAcceso: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    boletoEmitidoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      validate: {
        isInt: true,
        min: 1
      }
    }

  });
  return Acceso;
}