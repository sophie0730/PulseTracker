import { Router } from 'express';

import { showDashboard } from '../controllers/dashboard.js';

const router = Router();

router.route('/dashboard.html').get(showDashboard);

export default router;
