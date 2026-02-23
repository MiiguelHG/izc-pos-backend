import { DataTypes } from "sequelize";

export default (sequelize, Sequelize) => {
  const Invitado = sequelize.define("invitados", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]+$/, // Solo letras, números y espacios
        len: [3, 255], // Longitud entre 3 y 255 caracteres
      },
    },
    motivo: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s.,;:!?"'()\-]+$/, // Solo letras, números, espacios y algunos signos de puntuación
      },
    },
    usado: {
      type: DataTypes.ENUM('emitido', 'usado', 'cancelado'),
      allowNull: false,
      defaultValue: 'emitido',
      validate: {
        isIn: [['emitido', 'usado', 'cancelado']],
      },
    },
    boletoEmitidoId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: true
      }
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true
      }
    },
    museoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true
      }
    }
  });

  return Invitado;
}