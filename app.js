import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import db from './src/models/index.js';
import authRoutes from './src/routes/authRoutes.js';
import refreshTokenRoutes from './src/routes/refreshTokenRoutes.js';
import rolRoutes from './src/routes/rolesRoutes.js';
import usuarioRoutes from './src/routes/usuarioRoutes.js';
import articuloRoutes from './src/routes/articuloRoutes.js';
import formaPagoRoutes from './src/routes/formaPagoRoutes.js';
import { runSeeders } from './src/seeders/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales //
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas //
// Ruta simple de test
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Express.js server!'
    });
});


// --  Rutas de autenticación --
app.use('/api/auth', authRoutes);

// --  Rutas de artículos --
app.use('/api/articulos', articuloRoutes);

// --  Rutas de formas de pago --
app.use('/api/formasPago', formaPagoRoutes);

// // --  Rutas de tokens --
// app.use('/api/tokens', refreshTokenRoutes);

// // --  Rutas de roles --
// app.use('/api/roles', rolRoutes);

// // --  Rutas de usuarios --
// app.use('/api/usuarios', usuarioRoutes);

// Sincronizar la base de datos e iniciar el servidor
// Configurar opciones de sincronización según el entorno
const syncOptions = {};
if (process.env.NODE_ENV === "development") {
    syncOptions.force = true; // Borra y recrea tablas en desarrollo
} else if (process.env.NODE_ENV === "staging") {
    syncOptions.alter = true; // Actualiza tablas en staging
}

db.sequelize.sync(syncOptions).then(async () => {
    console.log('Database synchronized successfully');

    // Inicializar roles por defecto
    await runSeeders();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Error syncing database:', error);
});