export default (sequelize, Sequelize) => {
    const VentaBoleto = sequelize.define("venta_boletos", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fecha_venta: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        cantidad: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        total: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false
        },
    });

    return VentaBoleto;
}; 