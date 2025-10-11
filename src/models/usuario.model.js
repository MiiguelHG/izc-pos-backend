export default (sequelize, Sequelize) => {
    const Usuario = sequelize.define("usuarios", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        }, 
        password: {
            type: Sequelize.TEXT,
            allowNull:false,
            unique: true
        },
        activo: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
    });

    return Usuario;
};