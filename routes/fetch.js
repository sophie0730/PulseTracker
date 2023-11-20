import { Router } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import { param } from 'express-validator';
import * as fetch from '../controllers/fetch.js';

const router = Router();

router.route('/cpu').get(fetch.fetchCPU);

router.route('/memory').get(fetch.fetchMemory);

router.route('/disk/:type').get(fetch.fetchDisk);

router.route('/request').get(fetch.fetchHttpRequest);

router.route('/response').get(fetch.fetchResponse);

router.route('/request-second').get(fetch.fetchRequestSecond);

router.route('/cpu-load/:loadTime').get(
  param('time').isIn(['1', '5', '15']),
  fetch.fetchCPULoad,
);

export default router;
