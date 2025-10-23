export default (sequelize, Sequelize) => {
    const VentaProducto = sequelize.define("ventas_productos", {
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

    return VentaProducto;
};