import { Router } from 'express';

import { showGraph } from '../controllers/graph.js';

const router = Router();

router.route('/index.html').get(showGraph);
router.route('/graph').get(showGraph);
router.route('/alert').get(showGraph);
router.route('/target').get(showGraph);

export default router;
