export default (sequelize, Sequelize) => {
    const FormaPago = sequelize.define("formas_pago", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        forma_pago: {
            type: Sequelize.STRING,
            allowNull: false
        },
        descripcion: {
            type: Sequelize.STRING,
            allowNull: true
        },
    });

    return FormaPago;
};