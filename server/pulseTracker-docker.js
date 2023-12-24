/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import * as server from './app.js';
import { storeTimeout } from './utils/yml-util.js';

const storeWorkerPath = './workers/store.js';
const alertWorkerPath = './workers/alert.js';

function createWorker(scriptPath) {
  const worker = Bun.spawn(['bun', scriptPath], {
    onExit(proc, exitCode, signalCode, error) {
      console.log(`child process exit, code: ${exitCode}, signal: ${signalCode}`);
      console.log('child process restarting...');
      createWorker(scriptPath);
    },
    ipc(message) {
      if (message.type === 'heartbeat') {
        worker.lastHeartbeat = Date.now();
      }
    },
    stdio: ['inherit', 'inherit', 'inherit'],
  });

  worker.lastHeartbeat = Date.now();
  return worker;
}

const storeWorker = createWorker(storeWorkerPath);
const alertWorker = createWorker(alertWorkerPath);

setInterval(() => {
  if (Date.now() - storeWorker.lastHeartbeat > storeTimeout * 1000 + 10000) {
    console.log('Heartbeat from store worker is lost. Restarting...');
    storeWorker.kill();
  }
  if (Date.now() - alertWorker.lastHeartbeat > storeTimeout * 1000 + 10000) {
    console.log('Heartbeat from alert worker is lost. Restarting...');
    alertWorker.kill();
  }
}, 5000);
