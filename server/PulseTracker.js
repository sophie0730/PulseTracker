/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import * as server from './app.js';
import * as storeWorker from './workers/store.js';
import * as alertWorker from './workers/alert.js';

const storeWorkerPath = './workers/store.js';
const alertWorkerPath = './workers/alert.js';

const storeProc = Bun.spawn(['bun', storeWorkerPath], {
  onExit(proc, exitCode, signalCode, error) {
    console.log(proc, exitCode);
  },
  stdio: ['inherit', 'inherit', 'inherit'],
});

await storeProc.exit;
