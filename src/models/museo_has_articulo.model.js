import { DataTypes } from "sequelize";

export default (sequelize, Sequelize) => {
    const MuseoHasArticulo = sequelize.define("museo_has_articulos", {
        museoId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            validate: {
                isInt: true
            }
        },
        articuloId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            validate: {
                isInt: true
            }
        }
    });
    return MuseoHasArticulo;
}