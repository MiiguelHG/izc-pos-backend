import express from 'express';
import { ArticuloController } from '../controllers/articuloController.js';
import {authJwt} from '../middlewares/index.js';

const router = express.Router();

router.get('/', [authJwt.verifyToken], ArticuloController.getArticulo);
router.get('/:id', [authJwt.verifyToken], ArticuloController.getArticuloById);
router.post('/', [authJwt.verifyToken, authJwt.isAdmin], ArticuloController.createArticulo);
router.put('/:id', [authJwt.verifyToken, authJwt.isAdmin], ArticuloController.updateArticulo);
router.delete('/:id', [authJwt.verifyToken, authJwt.isAdmin], ArticuloController.deleteArticulo);
router.get('/tipo/:tipo', [authJwt.verifyToken], ArticuloController.obtenerPorTipo);