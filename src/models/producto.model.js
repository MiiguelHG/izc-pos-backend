export default (sequelize, Sequelize) => {
    const Producto = sequelize.define("productos", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: Sequelize.STRING,
            allowNull: false
        },
        precio: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false
        },
        descripcion: {
            type: Sequelize.STRING,
            allowNull: true
        },
    });

    return Producto;
};