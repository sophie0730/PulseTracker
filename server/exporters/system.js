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

const guageCPULoad1m = new client.Gauge({
  name: 'CPU_Load_1m',
  help: 'Average Load duration 1m',
});

const guageCPULoad5m = new client.Gauge({
  name: 'CPU_Load_5m',
  help: 'Average Load 5m',
});

const guageCPULoad15m = new client.Gauge({
  name: 'CPU_Load_15m',
  help: 'Average Load 15m',
});

const guageCPUsage = new client.Gauge({
  name: 'CPU_Average_Usage',
  help: '(%)',
});

const guageMemoryUsage = new client.Gauge({
  name: 'Memory_Usage',
  help: '(%)',
});

const guageDiskRead = new client.Gauge({
  name: 'Disk_Read_Average_Time',
  help: '(ms)',
  labelNames: ['device'],
});
const guageDiskWrite = new client.Gauge({
  name: 'Disk_Write_Average_Time',
  help: '(ms)',
  labelNames: ['device'],
});

register.registerMetric(guageCPULoad1m);
register.registerMetric(guageCPULoad5m);
register.registerMetric(guageCPULoad15m);
register.registerMetric(guageCPUsage);
register.registerMetric(guageMemoryUsage);
register.registerMetric(guageDiskRead);
register.registerMetric(guageDiskWrite);

async function setMetrics() {

  guageCPULoad1m.set(os.loadavg()[0]);
  guageCPULoad5m.set(os.loadavg()[1]);
  guageCPULoad15m.set(os.loadavg()[2]);

  const CPUsage = calculate.getCPUInfo();
  guageCPUsage.set(CPUsage);

  const memoryUsage = calculate.getMemoryUsage();
  guageMemoryUsage.set(memoryUsage);

  // disk info

  const diskInfos = await calculate.getDiskInfo();
  for (const info of diskInfos) {
    guageDiskRead.set({ device: info.diskDevice }, info.readAwait);
    guageDiskWrite.set({ device: info.diskDevice }, info.writeAwait);

  }
}

app.get('/metrics', async (req, res) => {
  try {
    await setMetrics();
    res.set('Content-Type', register.contentType);
    res.send(await register.metrics());
  } catch (error) {
    console.error(error);
    res.status(500).send('Error setting metrics');
  }
});

app.listen(9100, '0.0.0.0', () => {
  console.log('The port in openning in 9100');
});
