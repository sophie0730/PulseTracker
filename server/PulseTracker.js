/* eslint-disable no-unused-vars */
import cluster from 'cluster';
import { influxPort, influxPath, redisPort } from './utils/yml-util.js';
import * as storeWorker from './workers/store.js';
import * as alertWorker from './workers/alert.js';
// import * as server from './app.js';

if (cluster.isPrimary) {
  import('./app.js').then(() => {
    console.log('server is running');
  });
}
