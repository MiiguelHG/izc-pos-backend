import express from 'express';
import { MuseoHasArticuloController } from '../controllers/museoHasArticuloController.js';
import { MuseoValidationMiddleware } from '../middlewares/museoArticuloMiddleware.js';

const router = express.Router();

// CRUD y utilidades para la relación Museo <-> Artículo
router.get('/', MuseoHasArticuloController.getAllAssociations);
router.post('/', MuseoValidationMiddleware.validateMuseoExists, MuseoHasArticuloController.addArticuloToMuseo);

router.get('/museo/:id', MuseoValidationMiddleware.validateMuseoExists, MuseoHasArticuloController.getByMuseo);
router.get('/museo/:id/articulos', MuseoValidationMiddleware.validateMuseoExists, MuseoHasArticuloController.getArticulosByMuseoId);
router.put('/museo/:id', MuseoValidationMiddleware.validateMuseoExists, MuseoHasArticuloController.setArticulosForMuseo);

router.get('/articulo/:id', MuseoHasArticuloController.getByArticulo);

router.delete('/:museoId/:articuloId', MuseoValidationMiddleware.validateMuseoExists, MuseoHasArticuloController.removeArticuloFromMuseo);

export default router;
