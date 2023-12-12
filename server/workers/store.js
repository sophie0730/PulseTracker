/* eslint-disable no-restricted-globals */
import * as store from '../models/store.js';
import { storeTimeout } from '../utils/yml-util.js';

const TIMEOUT = storeTimeout * 1000; // unit of storeTimeout = second

function scheduleStoreExporterStatus() {
  store.storeExporterStatus()
    .then(() => {
      setTimeout(scheduleStoreExporterStatus, TIMEOUT);
    })
    .catch((error) => {
      console.error(error);
      setTimeout(scheduleStoreExporterStatus, TIMEOUT);
    });
}

function scheduleStoreExporterMetrices() {
  store.storeExporterMetrices()
    .then(() => {
      setTimeout(scheduleStoreExporterMetrices, TIMEOUT);
    })
    .catch((error) => {
      console.error(error);
      setTimeout(scheduleStoreExporterMetrices, TIMEOUT);
    });
}

scheduleStoreExporterMetrices();
scheduleStoreExporterStatus();

// function sendHeartbeat() {
//   process.send({ type: 'heartbeat' });
// }

// setInterval(sendHeartbeat, TIMEOUT);
