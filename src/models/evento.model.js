export default (sequelize, Sequelize) => {
    const Evento = sequelize.define("eventos", {
        id: {
            type: Sequelize.INTEGER,   
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: Sequelize.STRING,
            allowNull: false
        },
        fecha_inicio: {
            type: Sequelize.DATE,
            allowNull: false
        },
        fecha_fin: {
            type: Sequelize.DATE,
            allowNull: false
        },
        lugar: {
            type: Sequelize.STRING,
            allowNull: false
        },
        capacidad: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        precio: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false
        },
    });

    return Evento;
};