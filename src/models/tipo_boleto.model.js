export default (sequelize, Sequelize) => {
    const BoletoEmitido = sequelize.define("boletos_emitidos", {
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
        validez_dias: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
    });

    return BoletoEmitido;
};