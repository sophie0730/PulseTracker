import { Router } from 'express';
import { showAlerts, searchAlerts } from '../controllers/alert.js';

const router = Router();

router.route('/alert').get(showAlerts);

router.route('/alert/search').get(searchAlerts);

export default router;
