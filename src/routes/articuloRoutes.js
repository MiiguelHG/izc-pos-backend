import express from 'express';
import { ArticuloController } from '../controllers/articuloController.js';
// import {authJwt} from '../middlewares/index.js';

const router = express.Router();

router.get('/tipo/:tipo', ArticuloController.obtenerPorTipo);

router.get('/', ArticuloController.getArticulo);
router.get('/:id', ArticuloController.getArticuloById);
router.post('/', ArticuloController.createArticulo);
router.put('/:id', ArticuloController.updateArticulo);
router.delete('/:id', ArticuloController.deleteArticulo);

export default router;