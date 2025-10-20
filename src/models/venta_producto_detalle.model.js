export default (sequelize, Sequelize) => {
    const VentaProductoDetalle = sequelize.define("ventas_productos_detalle", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cantidad: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        precio_unitario: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false
        },
        sub_total: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false
        },
    });

    return VentaProductoDetalle;
};