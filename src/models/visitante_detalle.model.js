import { DataTypes } from "sequelize";

export default (sequelize, Sequelize) => {
  const VisitanteDetalle = sequelize.define("visitante_detalles", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    edad: {
            type: DataTypes.INTEGER,
            allowNull: false,
    },
    cantidadHombres: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cantidadMujeres: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cantidadOtros: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    visitanteId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return VisitanteDetalle;
}