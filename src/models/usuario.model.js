import { DataTypes } from "sequelize";
import bcrypt from "bcryptjs";

export default (sequelize, Sequelize) => {
    const Usuario = sequelize.define("usuarios", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        rolId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        museoId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
        
    });

    // Hooks para hashear la contraseña antes de crear o actualizar un usuario
    Usuario.beforeCreate(async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    });

    Usuario.beforeUpdate(async (user) => {
        if (user.changed('password')) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
    });

    // Metodo para validar la contraseña
    Usuario.prototype.validatePassword = async function(password) {
        const result = await bcrypt.compare(password, this.password);
        console.log('Comparing passwords:', password, this.password, result);
        return result;
    };

    return Usuario;
};