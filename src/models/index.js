// Aqui se Inicializan las tablas y se crean las relaciones
import { Sequelize } from "sequelize";

import sequelize from "../config/database.js";
import articuloModel from "./articulo.model.js";
import usuarioModel from "./usuario.model.js";
import rolModel from "./rol.model.js";
import refreshTokenModel from "./refresh_tokens.model.js";
import boletoTipoModel from "./boleto_tipo.model.js";
import boletoVentaModel from "./boleto_venta.model.js";
import boletoEmitidoModel from "./boleto_emitido.model.js";
import reservaEventoModel from "./reserva_evento.model.js";
import productoDetalleModel from "./producto_detalle.model.js";
import productoVentaModel from "./producto_venta.model.js";
import museoModel from "./museo.model.js";
import formaPagoModel from "./forma_pago.model.js";
import visitanteModel from "./visitante.model.js";
import museoHasUsuarioModel from "./museo_has_usuario.model.js";
import museoHasArticuloModel from "./museo_has_articulo.model.js";
import visitanteDetalleModel from "./visitante_detalle.model.js";

// Definir el objeto de la base de datos
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.usuario = usuarioModel(sequelize, Sequelize);
db.rol = rolModel(sequelize, Sequelize);
db.articulo = articuloModel(sequelize, Sequelize);
db.refreshToken = refreshTokenModel(sequelize, Sequelize);
db.boletoTipo = boletoTipoModel(sequelize, Sequelize);
db.boletoVenta = boletoVentaModel(sequelize, Sequelize);
db.boletoEmitido = boletoEmitidoModel(sequelize, Sequelize);
db.reservaEvento = reservaEventoModel(sequelize, Sequelize);
db.productoDetalle = productoDetalleModel(sequelize, Sequelize);
db.productoVenta = productoVentaModel(sequelize, Sequelize);
db.museo = museoModel(sequelize, Sequelize);
db.formaPago = formaPagoModel(sequelize, Sequelize);
db.visitante = visitanteModel(sequelize, Sequelize);
db.museoHasUsuario = museoHasUsuarioModel(sequelize, Sequelize);
db.museoHasArticulo = museoHasArticuloModel(sequelize, Sequelize);
db.visitanteDetalle = visitanteDetalleModel(sequelize, Sequelize);

// Relaciones entre tablas

//Relacion usuario - rol (N:1) (Revisado)
db.usuario.belongsTo(db.rol, {foreignKey: "rolId", as: "rol"});
db.rol.hasMany(db.usuario, {foreignKey: "rolId", as: "usuarios"});

//Relacion usuario - refreshtoken (1:N) (Revisado)
db.usuario.hasMany(db.refreshToken, {foreignKey:"usuarioId"});
db.refreshToken.belongsTo(db.usuario, {foreignKey:"usuarioId"});

// Relacion visitante - visitante_detalle (1:N) (Revisado)
db.visitante.hasMany(db.visitanteDetalle, {foreignKey: "visitanteId"});
db.visitanteDetalle.belongsTo(db.visitante, {foreignKey: "visitanteId"});

// Relaciones de articulos----------------------------------------
// Relacion articulo - boleto_tipo (1:N) (Revisado)
db.articulo.hasMany(db.boletoTipo, {foreignKey: "articuloId"});
db.boletoTipo.belongsTo(db.articulo, {foreignKey: "articuloId"});

// Relacion articulo - reserva_evento (1:N) (Revisado)
db.articulo.hasMany(db.reservaEvento, {foreignKey: "articuloId"});
db.reservaEvento.belongsTo(db.articulo, {foreignKey: "articuloId"});

// Relacion articulo - producto_detalle (1:N) (Revisado)
db.articulo.hasMany(db.productoDetalle, {foreignKey: "articuloId"});
db.productoDetalle.belongsTo(db.articulo, {foreignKey: "articuloId"});
//------------------------------------------------------------------

// Relaciones de boletos--------------------------------------------
// Reclacion boleto_tipo - boleto_venta (1:N) (Revisado)
db.boletoTipo.hasMany(db.boletoVenta, {foreignKey: "boletoTipoId"});
db.boletoVenta.belongsTo(db.boletoTipo, {foreignKey: "boletoTipoId"});

// Relacion boleto_venta - boleto_emitido (1:N) (Revisado)
db.boletoVenta.hasMany(db.boletoEmitido, {foreignKey: "boletoVentaId"});
db.boletoEmitido.belongsTo(db.boletoVenta, {foreignKey: "boletoVentaId"});

// Relacion boleto_emitido - museo (N:1) (Revisado)
db.boletoEmitido.belongsTo(db.museo, {foreignKey: "museoId"});
db.museo.hasMany(db.boletoEmitido, {foreignKey: "museoId"});

// Relacion boleto_emitido - usuario (N:1) (Revisado)
db.boletoEmitido.belongsTo(db.usuario, {foreignKey: "usuarioId"});
db.usuario.hasMany(db.boletoEmitido, {foreignKey: "usuarioId"});

// Relacion boleto_emitido - forma_pago (N:1) (Revisado)
db.boletoEmitido.belongsTo(db.formaPago, {foreignKey: "formaPagoId"});
db.formaPago.hasMany(db.boletoEmitido, {foreignKey: "formaPagoId"});

// Relacion boleto_emitido - visitante (1:1) (Revisado)
db.boletoEmitido.belongsTo(db.visitante, {foreignKey: "visitanteId"});
db.visitante.hasOne(db.boletoEmitido, {foreignKey: "visitanteId"});
//------------------------------------------------------------------

// Relaciones de reserva evento--------------------------------------
// Relacion reserva_evento - museo (N:1) (Revisado)
db.reservaEvento.belongsTo(db.museo, {foreignKey: "museoId"});
db.museo.hasMany(db.reservaEvento, {foreignKey: "museoId"});

// Relacion reserva_evento - usuario (N:1) (Revisado)
db.reservaEvento.belongsTo(db.usuario, {foreignKey: "usuarioId"});
db.usuario.hasMany(db.reservaEvento, {foreignKey: "usuarioId"});

// Relacion reserva_evento - forma_pago (N:1) (Revisado)
db.reservaEvento.belongsTo(db.formaPago, {foreignKey: "formaPagoId"});
db.formaPago.hasMany(db.reservaEvento, {foreignKey: "formaPagoId"});

// Relacion reserva_evento - visitante (1:1) (Revisado)
db.reservaEvento.belongsTo(db.visitante, {foreignKey: "visitanteId"});
db.visitante.hasOne(db.reservaEvento, {foreignKey: "visitanteId"});
//------------------------------------------------------------------

// Relaciones de productos-------------------------------------------
// Relacion producto_detalle - producto_venta (1:N) (Revisado)
db.productoDetalle.hasMany(db.productoVenta, {foreignKey: "productoDetalleId"});
db.productoVenta.belongsTo(db.productoDetalle, {foreignKey: "productoDetalleId"});

// Relacion producto_venta - museo (N:1) (Revisado)
db.productoVenta.belongsTo(db.museo, {foreignKey: "museoId"});
db.museo.hasMany(db.productoVenta, {foreignKey: "museoId"});

// Relacion producto_venta - usuario (N:1) (Revisado)
db.productoVenta.belongsTo(db.usuario, {foreignKey: "usuarioId"});
db.usuario.hasMany(db.productoVenta, {foreignKey: "usuarioId"});

// Relacion producto_venta - forma_pago (N:1) (Revisado)
db.productoVenta.belongsTo(db.formaPago, {foreignKey: "formaPagoId"});
db.formaPago.hasMany(db.productoVenta, {foreignKey: "formaPagoId"});
//------------------------------------------------------------------

// Relaciones visitante ----------------------------------------------
// Relacion visitante - museo (N:1) (Revisado)
db.visitante.belongsTo(db.museo, {foreignKey: "museoId"});
db.museo.hasMany(db.visitante, {foreignKey: "museoId"});

// Relacion visitante - usuario (N:1) (Revisado)
db.visitante.belongsTo(db.usuario, {foreignKey: "usuarioId"});
db.usuario.hasMany(db.visitante, {foreignKey: "usuarioId"});
//------------------------------------------------------------------

// Relaciones museos --------------------------------------------------
// Relacion museo - usuario (1:N) (Revisado)
db.museo.hasMany(db.usuario, {foreignKey: "museoId"});
db.usuario.belongsTo(db.museo, {foreignKey: "museoId"});

// Relacion museo - articulo (N:M) (Revisado)
db.museo.belongsToMany(db.articulo, {
    through: db.museoHasArticulo,
    foreignKey: "museoId",
    otherKey: "articuloId",
    as: "articulos"
});

db.articulo.belongsToMany(db.museo, {
    through: db.museoHasArticulo,
    foreignKey: "articuloId",
    otherKey: "museoId",
    as: "museos"
});
//------------------------------------------------------------------

db.ROLES = ["user", "admin", "moderator"];

export default db;
