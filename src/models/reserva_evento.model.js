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
            allowNull: false
        },
        contactoResponsable: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // must be a cellular phone number (10 digits)
                is: {
                    args: [/^\d{10}$/],
                    msg: "El contacto debe ser un número de teléfono celular válido (10 dígitos)"
                }
            }
        },
        capacidad: {
            type: DataTypes.INTEGER,
            allowNull: false
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
            allowNull: false
        },
        estado: {
            type: DataTypes.ENUM("reservado", "cancelado", "asistido"),
            allowNull: false,
            defaultValue: "reservado"
        },
        usuarioId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        museoId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        articuloId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        visitanteId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        formaPagoId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    return ReservaEvento;
};