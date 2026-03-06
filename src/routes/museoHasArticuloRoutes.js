import express from 'express';
import { MuseoHasArticuloController } from '../controllers/museoHasArticuloController.js';
import { MuseoValidationMiddleware } from '../middlewares/museoArticuloMiddleware.js';
import { authJwt } from '#middlewares/index.js';

const router = express.Router();

router.use(authJwt.verifyToken); // Proteger todas las rutas con autenticación

// CRUD y utilidades para la relación Museo <-> Artículo
router.get('/', MuseoHasArticuloController.getAllAssociations);

router.post('/', authJwt.hasRole(['admin']), MuseoValidationMiddleware.validateMuseoExists, MuseoHasArticuloController.addArticuloToMuseo);

router.get('/museo/:id', MuseoValidationMiddleware.validateMuseoExists, MuseoHasArticuloController.getByMuseo);
router.get('/museo/:id/articulos/:tipo', MuseoValidationMiddleware.validateMuseoExists, MuseoHasArticuloController.getArticulosByMuseoId);
router.put('/museo/:id', authJwt.hasRole(['admin']), MuseoValidationMiddleware.validateMuseoExists, MuseoHasArticuloController.setArticulosForMuseo);

router.get('/articulo/:id', MuseoHasArticuloController.getByArticulo);
router.put('/:articuloId/toggle',authJwt.hasRole(['admin', 'directorMuseo']), MuseoHasArticuloController.toggleEnableArticulosForMuseo);

export default router;
