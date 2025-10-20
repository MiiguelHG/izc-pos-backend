export default (sequelize, Sequelize) => {
    const BoletoEmitido = sequelize.define("boletos_emitidos", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        codigo_qr: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        estado: {
            type: Sequelize.ENUM('activo', 'usado', 'cancelado'),
            defaultValue: 'activo'
        },
    });

    return BoletoEmitido;
};