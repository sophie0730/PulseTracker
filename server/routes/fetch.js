import { Router } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as fetch from '../controllers/fetch.js';

const router = Router();

router.route('/targets').get(fetch.fetchTargets);

router.route('/fetchItems').get(fetch.fetchAllItems);

router.route('/fetch/:item').get(fetch.fetchDataByItems);

export default router;
