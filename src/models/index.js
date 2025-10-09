// Aqui se Inicializan las tablas y se crean las relaciones
import { Sequelize } from "sequelize";

import sequelize from "../config/database.js";
import boleto_emitido from "./boleto_emitido.model.js";
import evento from "./evento.model.js";
import forma_pago from "./forma_pago.model.js";
import producto from "./producto.model.js";
import refresh_token from "./refresh_tokens.model.js";
import reserva_evento from "./reserva_evento.model.js";
import rol from "./rol.model.js";
import tipo_boleto from "./tipo_boleto.model.js";
import tipo_evento from "./tipo_evento.model.js";
import usuario from "./usuario.model.js";
import venta_boleto from "./venta_boleto.model.js";
import venta_producto from "./venta_producto.model.js";
import venta_producto_detalle from "./venta_producto_detalle.model.js";
import visitante from "./visitante.model.js";
import dbConfig from "../config/database.js";
// import dotenv from "dotenv";
// dotenv.config();

<<<<<<< HEAD
<<<<<<< HEAD
// Inicializar la conexion a la base de datos
// const sequelize = new Sequelize(
//     dbConfig.DB, 
//     dbConfig.USER, 
//     dbConfig.PASSWORD, 
//     {
//     host: dbConfig.HOST,
//     dialect: dbConfig.DIALECT,
//     port: dbConfig.PORT,
//     }
// );
=======

>>>>>>> d45b712 (CambiosRelaciones2)
=======
// Inicializar la conexion a la base de datos
<<<<<<< HEAD
const sequelize = new Sequelize(
    dbConfig.DB, 
    dbConfig.USER, 
    dbConfig.PASSWORD, 
    {
    host: dbConfig.HOST,
    dialect: dbConfig.DIALECT,
    port: dbConfig.PORT,
    }
);
>>>>>>> e6e1a1d (Middlewares)
=======
// const sequelize = new Sequelize(
//     dbConfig.DB, 
//     dbConfig.USER, 
//     dbConfig.PASSWORD, 
//     {
//     host: dbConfig.HOST,
//     dialect: dbConfig.DIALECT,
//     port: dbConfig.PORT,
//     }
// );
>>>>>>> bf641b4 (autenticacion_V1)

// Definir el objeto de la base de datos
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.usuario = usuario(sequelize, Sequelize);
db.rol = rol(sequelize, Sequelize);
db.boleto_emitido = boleto_emitido(sequelize, Sequelize);
db.evento = evento(sequelize, Sequelize);
db.tipo_boleto = tipo_boleto(sequelize, Sequelize);
db.tipo_evento = tipo_evento(sequelize, Sequelize);
db.forma_pago = forma_pago(sequelize, Sequelize);
db.producto = producto(sequelize, Sequelize);
db.refresh_tokens = refresh_token(sequelize, Sequelize);
db.reserva_evento = reserva_evento(sequelize, Sequelize);
db.venta_boleto = venta_boleto(sequelize, Sequelize);
db.venta_producto = venta_producto(sequelize, Sequelize);
db.venta_producto_detalle = venta_producto_detalle(sequelize, Sequelize);
db.visitante = visitante(sequelize, Sequelize);

// Relaciones entre tablas

//Relacion usuario - rol (N:1) (Revisado)
db.usuario.belongsTo(db.rol, {foreignKey: "id_rol", as: "rol"});
db.rol.hasMany(db.usuario, {foreignKey: "id_rol", as: "usuarios"});

//Relacion usuario - refreshtoken (1:N) (Revisado)
db.usuario.hasMany(db.refresh_tokens, {foreignKey:"id_usuario"});
db.refresh_tokens.belongsTo(db.usuario, {foreignKey:"id_usuario"});

//Relacion usuario - ventaboleto (1:N) (Revisado)
db.usuario.hasMany(db.venta_boleto, {foreignKey: "id_usuario"});
db.venta_boleto.belongsTo(db.usuario, {foreignKey: "id_usuario"});

//Relacion usuario - ventaproducto (1:N) Revisado
db.usuario.hasMany(db.venta_producto, {foreignKey: "id_usuario"});
db.venta_producto.belongsTo(db.usuario, {foreignKey: "id_usuario"});

//Relacion visitante - ventaboleto (1:N) Revisado
db.visitante.hasMany(db.venta_boleto, {foreignKey: "id_visitante"});
db.venta_boleto.belongsTo(db.visitante, {foreignKey: "id_visitante"});

//Relacion visitante - reservaevento (1:N) Revisado
db.visitante.hasMany(db.reserva_evento, {foreignKey: "id_visitante"});
db.reserva_evento.belongsTo(db.visitante, {foreignKey: "id_visitante"});

//Relacion visitante - venta producto (1:N) Revisado
db.visitante.hasMany(db.venta_producto, {foreignKey: "id_visitante"});
db.venta_producto.belongsTo(db.visitante, {foreignKey: "id_visitante"});

//Relacion venta boleto - boleto emitido (1:N) (Revisado)
db.venta_boleto.hasMany(db.boleto_emitido, { foreignKey: "id_ventaBoleto", onDelete: "CASCADE" });
db.boleto_emitido.belongsTo(db.venta_boleto, { foreignKey: "id_ventaBoleto" });

//Relacion boleto emitido - tipo de boleto (N:1) (Revisado)
db.tipo_boleto.hasMany(db.boleto_emitido, { foreignKey: "id_tipoBoleto" });
db.boleto_emitido.belongsTo(db.tipo_boleto, { foreignKey: "id_tipoBoleto" });

//Relacion venta boleto - forma pago (N:1) Revisado
db.forma_pago.hasMany(db.venta_boleto, { foreignKey: "id_formaPago" });
db.venta_boleto.belongsTo(db.forma_pago, { foreignKey: "id_formaPago" });

//Relacion venta producto - forma de pago (N:1) Revisado
db.forma_pago.hasMany(db.venta_producto, { foreignKey: "id_formaPago" });
db.venta_producto.belongsTo(db.forma_pago, { foreignKey: "id_formaPago" });

//Relacion venta producto - venta producto detalle (1:N) Revisado
db.venta_producto.hasMany(db.venta_producto_detalle, {foreignKey: "id_ventaProducto"});
db.venta_producto_detalle.belongsTo(db.venta_producto, {foreignKey: "id_ventaProducto"});

//Relacion venta producto detalle - producto (1:N) Revisado
db.venta_producto_detalle.hasMany(db.producto, {foreignKey: "id_producto"});
db.producto.belongsTo(db.venta_producto_detalle, {foreignKey: "id_producto"});

//Relacion evento - tipo evento (N:1) Revisado
db.evento.belongsTo(db.tipo_evento, {foreignKey: "id_tipoevento"});
db.tipo_evento.hasMany(db.evento, {foreignKey: "id_tipoevento"});

//Relacion evento - reserva evento (1:N) Revisado
db.reserva_evento.belongsTo(db.evento, {foreignKey: "id_evento"});
db.evento.hasMany(db.reserva_evento, {foreignKey: "id_evento"});

db.ROLES = ["user", "admin", "moderator"];

export default db;
