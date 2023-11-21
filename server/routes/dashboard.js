import { Router } from 'express';

import { showDashboard } from '../controllers/dashboard.js';

const router = Router();

<<<<<<< HEAD
router.route('/index.html').get(showDashboard);
router.route('/graph').get(showDashboard);
router.route('/alert').get(showDashboard);
router.route('/target').get(showDashboard);
=======
router.route('/dashboard.html').get(showDashboard);
>>>>>>> dc592ac9 (fix: update project structure for adding react frameworke)

export default router;
