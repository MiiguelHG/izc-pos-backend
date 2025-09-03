// Aqui se Inicializan las tablas y se crean las relaciones
import { Sequelize } from "sequelize";

import sequelize from "../config/database.js";


// Definir el objeto de la base de datos
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

export default db;
