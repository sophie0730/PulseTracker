/* eslint-disable no-unused-vars */
import * as server from './app.js';
import * as storeWorker from './workers/store.js';
import * as alertWorker from './workers/alert.js';

// function createWorker(fileName) {
//   const url = new URL(`./workers/${fileName}`, import.meta.url);
//   const worker = new Worker(url, { type: 'module' });

//   worker.onmessage = (event) => {
//     console.log(`Message from Worker: ${event.data}`);
//   };

//   worker.onerror = (error) => {
//     console.error('Worker error', error);
//     worker.terminate();
//     createWorker();
//   };

//   return worker;
// }

// const store = createWorker('store.js');
// const alert = createWorker('alert.js');

// store.postMessage('Start store worker tasks');
// alert.postMessage('Start alert worker tasks');
