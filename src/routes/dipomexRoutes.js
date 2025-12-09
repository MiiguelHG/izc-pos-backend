import express from 'express';
import { DipomexController } from '#controllers/dipomexController.js';

const router = express.Router();

router.get('/estados', DipomexController.getEstados);
router.get('/cp/:cp', DipomexController.getByCodigoPostal);

export default router;