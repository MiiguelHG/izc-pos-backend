export default (sequelize, Sequelize) => {
    const VentaBoleto = sequelize.define("venta_boletos", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        total: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false
        },
    });

    return VentaBoleto;
}; 