import { Router } from 'express';
import * as dashboard from '../controllers/dashboard.js';

const router = Router();

router.route('/save-json').post(dashboard.saveDashboardTable);
router.route('/read-json').get(dashboard.readDashboardTable);

export default router;
