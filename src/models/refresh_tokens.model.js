export default (sequelize, Sequelize) => {
    const RefreshToken = sequelize.define("refresh_tokens", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        token_hash: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW

        },
        expires_at: {
            type: Sequelize.DATE,
            allowNull: false
        },
        revoked_at: {
            type: Sequelize.DATE,
            allowNull: true
        },
        replaced_by_token: {
            type: Sequelize.INTEGER,
            allowNull: true
        },

    });

    return RefreshToken;
};