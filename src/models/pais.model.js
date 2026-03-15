import { DataTypes } from "sequelize"

export default (sequelize, Sequelize) => {
    const Pais = sequelize.define("paises", {
      nameES: {
        type: DataTypes.STRING,
        allowNull: false
      },
      nameEN: {
        type: DataTypes.STRING,
        allowNull: false
      },
      iso2: {
        type: DataTypes.STRING(2),
        allowNull: false,
        unique: true
      },
      iso3: {
        type: DataTypes.STRING(3),
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      phoneCode: {
        type: DataTypes.STRING,
        allowNull: false
      }
    });
    return Pais;
}