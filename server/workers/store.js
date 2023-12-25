/* eslint-disable no-restricted-globals */
import { storeExporterMetrices, storeExporterStatus } from '../models/store.js';
import { storeTimeout } from '../utils/yml-util.js';

const TIMEOUT = storeTimeout * 1000; // unit of storeTimeout = second

function scheduleOperation(operation) {
  operation()
    .then(() => {
      setTimeout(() => scheduleOperation(operation), TIMEOUT);
    })
    .catch((error) => {
      console.error(error);
      setTimeout(() => scheduleOperation(operation), TIMEOUT);
    });
}

scheduleOperation(storeExporterMetrices);
scheduleOperation(storeExporterStatus);

function sendHeartbeat() {
  process.send({ type: 'heartbeat' });
}

setInterval(sendHeartbeat, TIMEOUT);
