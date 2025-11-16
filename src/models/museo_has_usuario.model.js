import { DataTypes } from "sequelize";

export default (sequelize, Sequelize) => {
    const MuseoHasUsuario = sequelize.define("museo_has_usuarios", {
        museoId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        usuarioId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        } 
    });
    
    return MuseoHasUsuario;
}