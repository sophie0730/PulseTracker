import cluster from 'cluster';
import * as store from '../models/store.js';
import { storeTimeout } from '../utils/yml-util.js';

const TIMEOUT = storeTimeout * 1000; // unit of storeTimeout = second

const HEARTBEAT_INTERVAL = 5000;
const MISSED_HEARTBEAT_THRESHOLD = 10000;

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

// scheduleStoreExporterMetrices();
// scheduleStoreExporterStatus();

function sendHeartbeat() {
  setInterval(() => {
    process.send({ type: 'heartbeat', workerId: cluster.worker.id });
  }, HEARTBEAT_INTERVAL);
}

if (cluster.isPrimary) {
  const heartbeats = {};

  cluster.fork(); // create the first child process

  cluster.on('message', (worker, message) => {
    if (message.type === 'heartbeat') {
      heartbeats[message.workerId] = Date.now();
    }
  });

  setInterval(() => {
    const now = Date.now();
    Object.entries(heartbeats).forEach(([workerId, lastHeartbeat]) => {
      if (now - lastHeartbeat > MISSED_HEARTBEAT_THRESHOLD) {
        console.log(`Worker ${workerId} missed heartbeat.`);
        cluster.workers[workerId].kill();
        delete heartbeats[workerId];
        cluster.fork();
      }
    });
  }, 5000);
} else {
  console.log(`child process ${process.pid} is running...`);
  sendHeartbeat();
  scheduleStoreExporterStatus();
  scheduleStoreExporterMetrices();
}

// function sendHeartbeat(workerId, interval) {
//   setInterval(() => {
//     axios.post(`${serverPort}/heartbeat`, { workerId })
//       .then(() => console.log('Heartbeat has been sent to server'))
//       .catch((error) => console.error(`Error sending heartbeat from ${workerId}`, error));
//   }, interval);
// }
