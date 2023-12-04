/* eslint-disable import/no-extraneous-dependencies */
import cluster from 'cluster';
import { checkAlerts } from '../models/alert.js';
import { alertFile, alertTimeout } from '../utils/yml-util.js';

const CHECK_TIME_RANGE = '10s';
const TIMEOUT = alertTimeout * 1000; // unit: second

const HEARTBEAT_INTERVAL = 5000;
const MISSED_HEARTBEAT_THRESHOLD = 10000;

const alertStates = {};

function sendAlerts() {
  checkAlerts(alertStates, CHECK_TIME_RANGE, alertFile)
    .then(() => {
      setTimeout(sendAlerts, TIMEOUT);
    })
    .catch((error) => {
      console.error(error);
      setTimeout(sendAlerts, TIMEOUT);
    });
}

function sendHeartbeat() {
  setInterval(() => {
    process.send({ type: 'heartbeat', workerId: cluster.worker.id });
  }, HEARTBEAT_INTERVAL);
}

if (!cluster.isPrimary) {
  console.log(`child process ${process.pid} is running...`);
  sendHeartbeat();
  sendAlerts();
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
}
