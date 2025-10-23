export default (sequelize, Sequelize) => {
    const TipoEvento = sequelize.define("tipos_evento", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: Sequelize.STRING,
            allowNull: false
        },
        descripcion: {
            type: Sequelize.STRING,
            allowNull: true
        }
    });

    return TipoEvento;
};