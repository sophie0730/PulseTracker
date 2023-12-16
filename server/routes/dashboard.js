import { Router } from 'express';
import * as dashboard from '../controllers/dashboard.js';

const router = Router();

router.route('/save-json').post(dashboard.saveDashboardTable);
router.route('/read-json').get(dashboard.readDashboardTable);
router.route('/dashboard/:id').delete(dashboard.deleteDashboardTable);
router.route('/dashboard/:id').get(dashboard.getDashboardDetail);
router.route('/dashboard/:id/graph').get(dashboard.getDashboardGraph);
router.route('/dashboard/:id/graph').post(dashboard.addDashboardGraph);

export default router;
