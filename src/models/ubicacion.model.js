import { DataTypes } from "sequelize";

export default (sequelize, Sequelize) => { 
  const Ubicacion = sequelize.define("ubicaciones", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    calle: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s.,()]+$/,
          len: [3, 100]
        },
      },
    numero: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
          isInt: true,
          min: 1
      }
    },
    colonia: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          is: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s.,]+$/,
          len: [3, 100]
      }
    },
    ciudad: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          is: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s.,()]+$/,
          len: [3, 100]
      }
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          is: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s.,()]+$/,
          len: [3, 100]
      }
    },
    codigoPostal: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
          isInt: true,
          min: 10000,
          max: 99999
      }
    },
  });

  return Ubicacion;
}