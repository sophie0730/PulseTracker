import { Router } from 'express';

import { showDashboard } from '../controllers/dashboard.js';

const router = Router();

router.route('/index.html').get(showDashboard);
router.route('/graph').get(showDashboard);
router.route('/alert').get(showDashboard);
router.route('/target').get(showDashboard);

export default router;
