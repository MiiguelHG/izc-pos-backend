export default (sequelize, Sequelize) => {
    const Visitante = sequelize.define("visitantes", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        nombre: {
            type: Sequelize.STRING,
            allowNull: false
        },
        apellido: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true
        },
        telefono: {
            type: Sequelize.STRING,
            allowNull: true
        },
        cp: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        pais: {
            type: Sequelize.STRING,
            allowNull: true
        },
        genero: {
            type: Sequelize.STRING,
            allowNull: true
        },
        fecha_registro: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        grupo: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        cantidad_hombres: {
            type: Sequelize.INTEGER,
            allowNull: true
        }, 
        cantidad_mujeres: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        total_visitantes: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
    });

    return Visitante;
};