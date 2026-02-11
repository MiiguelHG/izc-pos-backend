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
    },
    motivo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fechaExpiracion: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    usado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    boletoEmitidoId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    museoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });

  return Invitado;
}