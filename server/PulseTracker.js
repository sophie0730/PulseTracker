import { spawn } from 'child_process';
import * as net from 'net';
import { influxPort, influxPath } from './utils/yml-util.js';

const workerPath = './workers/';
//  start influxdb
function checkPort(port, callback) {
  const server = net.createServer();

  server.once('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      callback(true);
    }
  });

  // 可以被監聽 代表 port還沒被占用
  server.once('listening', () => {
    server.close();
    callback(false);
  });

  server.listen(port);
}

function startInfluxDb() {
  checkPort(influxPort, (isUsed) => {
    if (!isUsed) {
      const influxDb = spawn(influxPath);
      influxDb.stdout.on('data', (data) => {
        console.log(data.toString());
      });
      influxDb.stderr.on('data', (data) => console.error(`Influxdb error: ${data.toString()}`));
      influxDb.on('close', (code) => console.log(`Influxdb is closed by code ${code}`));
    } else {
      console.log('InfluxDb has been already running.');
    }
  });
}

function startWorker(fileName) {
  const worker = spawn('node', [`${workerPath}/${fileName}`]);
  worker.stdout.on('data', (data) => console.log(data.toString()));
  worker.stderr.on('data', (data) => console.error(`Worker error: ${data.toString()}`));
  worker.on('close', (code) => console.log(`Worker is closed by code ${code}`));
}

function startServer() {
  const worker = spawn('node', ['app.js']);
  worker.stdout.on('data', (data) => console.log(data.toString()));
  worker.stderr.on('data', (data) => console.error(`Server error: ${data.toString()}`));
  worker.on('close', (code) => console.log(`Worker is closed by code ${code}`));
}

startInfluxDb();
startWorker('store.js');
startWorker('alert.js');
startServer();
