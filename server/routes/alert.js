import { Router } from 'express';
import { showAlerts } from '../controllers/alert.js';

const router = Router();

router.route('/alert').get(showAlerts);

export default router;
