/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-destructuring */
import express from 'express';
import cors from 'cors';
import * as os from 'os';
import * as client from 'prom-client';
import * as calculate from '../models/system-calculate.js';

const app = express();
app.use(express.json());
app.use(cors());

const register = new client.Registry();
const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics({
  app: 'node-exporter-2.0',
  timeout: 10000,
  gcDurationBuckets: [1, 2, 5, 7, 9],
  register,
});

register.registerMetric(
  new client.Gauge({
    name: 'load_duration_1m',
    help: 'Average Load duration 1m',
    collect() {
      const load = os.loadavg()[0];
      this.set(load);
    },
  }),
);

register.registerMetric(
  new client.Gauge({
    name: 'load_duration_5m',
    help: 'Average Load duration 5m',
    collect() {
      const load = os.loadavg()[1];
      this.set(load);
    },
  }),
);

register.registerMetric(
  new client.Gauge({
    name: 'load_duration_15m',
    help: 'Average Load duration 15m',
    collect() {
      const load = os.loadavg()[2];
      this.set(load);
    },
  }),
);

register.registerMetric(
  new client.Gauge({
    name: 'cpu_average_usage',
    help: 'CPU usage percentage',
    collect() {
      const CPUsage = calculate.getCPUInfo();
      this.set(CPUsage);
    },
  }),
);

register.registerMetric(
  new client.Gauge({
    name: 'memory_usage',
    help: 'Memory usage percentage',
    collect() {
      const memoryUsage = calculate.getMemoryUsage();

      this.set(memoryUsage);
    },
  }),
);

// disk info
const guageDiskRead = new client.Gauge({
  name: 'disk_read_average_time',
  help: 'Disk read average time per I/O (ms)',
  labelNames: ['device'],
});
const guageDiskWrite = new client.Gauge({
  name: 'disk_write_average_time',
  help: 'Disk write average time per I/O (ms)',
  labelNames: ['device'],
});

const diskInfos = await calculate.getDiskInfo();
console.log(diskInfos);
for (const info of diskInfos) {
  guageDiskRead.set({ device: info.diskDevice }, info.readAwait);
  guageDiskWrite.set({ device: info.diskDevice }, info.writeAwait);

}

register.registerMetric(guageDiskRead);
register.registerMetric(guageDiskWrite);

app.get('/metrics', async (req, res) => {
  // const info = calculate.diskRead();
  res.set('Content-Type', register.contentType);
  res.send(await register.metrics());
});

app.listen(9100, '0.0.0.0', () => {
  console.log('The port in openning in 9100');
});
