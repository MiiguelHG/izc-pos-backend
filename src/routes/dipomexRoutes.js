import express from 'express';
import { DipomexController } from '#controllers/dipomexController.js';
import { authJwt } from '#middlewares/index.js';

const router = express.Router();

router.use(authJwt.verifyToken); 

router.get('/estados', DipomexController.getEstados);
router.get('/cp/:cp', DipomexController.getByCodigoPostal);
router.get('/municipios/:estadoId', DipomexController.getMunicipiosByEstadoId);
router.get('/paises', DipomexController.getPaises);

export default router;