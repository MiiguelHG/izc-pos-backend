import { DataTypes } from "sequelize";

export default (sequelize, Sequelize) => {
    const ReservaEvento = sequelize.define("reserva_eventos", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombreEvento: {
            type: DataTypes.STRING,
            allowNull: false
        },
        responsable: { 
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]+$/, 
                len: [3, 255] 
            }
        },
        contactoResponsable: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isPhoneOrEmail(value) {
                    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                    const isPhone = /^[0-9]{15}$/.test(value); // Teléfono de 15 dígitos
                    if (!isEmail && !isPhone) {
                        throw new Error("El contacto debe ser un correo electrónico o un número de teléfono de máximo 15 dígitos");
                    }
                }
            }
        },
        fechaReserva: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        fechaInicio: {
            type: DataTypes.DATE,
            allowNull: false
        },
        fechaFin: {
            type: DataTypes.DATE,
            allowNull: false
        },
        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0,
                isDecimal: true
            }
        },
        estado: {
            type: DataTypes.ENUM("reservado", "cancelado", "asistido"),
            allowNull: false,
            defaultValue: "reservado",
            validate: {
                isIn: [["reservado", "cancelado", "asistido"]]
            }
        },
        usuarioId: {
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
        },
        articuloId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true
            }
        },
        visitanteId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true
            }
        },
        formaPagoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true
            }
        }
    });

    return ReservaEvento;
};