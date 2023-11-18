/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/extensions */
import express from 'express';
import cors from 'cors';
import * as client from 'prom-client';
import * as calculate from '../models/application-calculate.js';

const app = express();
app.use(express.json());
app.use(cors());

const register = new client.Registry();
const { collectDefaultMetrics } = client;

async function setMetrics() {
  collectDefaultMetrics({
    app: 'node-exporter-2.0',
    timeout: 10000,
    gcDurationBuckets: [1, 2, 5, 7, 9],
    register,
  });

  register.registerMetric(
    new client.Gauge({
      name: 'http_total_requests',
      help: 'http total request',
      async collect() {
        const totalRequest = await calculate.getTotalRequest();
        this.set(totalRequest);
      },
    }),
  );

  const apiResponseTimes = await calculate.getResponseTime();

  const guageResponseTime = new client.Gauge({
    name: 'max_response_time',
    help: 'max response time',
    labelNames: ['api'],
  });

  for (const api in apiResponseTimes) {
    const data = apiResponseTimes[api];
    if (data.name !== undefined) {
      guageResponseTime.set({ api: data.name }, data.max);
    }
  }

  const guageRequestPerSecond = new client.Gauge({
    name: 'request_per_second',
    help: 'Request per second',
    labelNames: ['time'],
  });

  const requestsPerSecond = await calculate.getRequestPerSecond();
  for (const request in requestsPerSecond) {
    const count = requestsPerSecond[request];
    guageRequestPerSecond.set({ time: request }, count);
  }

  register.registerMetric(guageResponseTime);
  register.registerMetric(guageRequestPerSecond);
}

setMetrics().then(() => {
  console.log('Metrics has been set up');
})
  .catch((error) => console.error(error));

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.send(await register.metrics());
});

app.listen(9101, () => {
  console.log('The port in openning in 9101');
});
