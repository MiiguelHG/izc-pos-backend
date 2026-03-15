import { DataTypes } from "sequelize";

export default (sequelize, Sequelize) => {
  const CodigoPostal = sequelize.define("codigos_postales", {
    cp: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false
    },
    estadoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true
        }
    },
    municipioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true
        }
    },
  });
  return CodigoPostal;
}