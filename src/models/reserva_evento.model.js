export default (sequelize, Sequelize) => {
    const ReservaEvento = sequelize.define("reservas_evento", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cantidad: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        fecha_reserva: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false
        },
        cantidad_asistentes: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        total: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false
        },
        estado: {
            type: Sequelize.ENUM("reservado", "cancelado", "asistido", "pagado"),
            allowNull: false,
            defaultValue: "reservado"
        },
    });

    return ReservaEvento;
};