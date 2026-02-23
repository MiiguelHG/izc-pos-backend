import express from 'express';
import { ArticuloController } from '#controllers/articuloController.js';
import { authJwt } from '#middlewares/index.js';

const router = express.Router();

router.use(authJwt.verifyToken);

router.get('/tipo/:tipo', authJwt.hasRole(['directorMuseo', 'admin']), ArticuloController.obtenerPorTipo);
router.put('/:id/toggle', authJwt.hasRole(['admin']), ArticuloController.toggleEnableArticulo);

router.get('/', authJwt.hasRole(['directorMuseo', 'admin']), ArticuloController.getArticulo);
router.get('/:id', authJwt.hasRole(['directorMuseo', 'admin']), ArticuloController.getArticuloById);
router.post('/', authJwt.hasRole(['admin']), ArticuloController.createArticulo);
router.put('/:id', authJwt.hasRole(['admin']), ArticuloController.updateArticulo);

export default router;