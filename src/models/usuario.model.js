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
            allowNull: false,
            validate: {
                notEmpty: true,
                is: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/,
                len: [3, 100]
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [6, 255]
            }
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        rolId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true
            }
        },
        museoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true
            }
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
        return await bcrypt.compare(password, this.password);
    };

    return Usuario;
};