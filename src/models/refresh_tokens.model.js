import { DataTypes } from "sequelize";

export default (sequelize, Sequelize) => {
    const RefreshToken = sequelize.define("refresh_tokens", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW

        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        revokedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        usuarioId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }

    });

    return RefreshToken;
};