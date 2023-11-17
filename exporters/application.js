/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/extensions */
import express from 'express';
import cors from 'cors';
import * as client from 'prom-client';
import * as calculate from '../model/application-calculate.js';
import * as moment from 'moment';

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

  for (const api in apiResponseTimes) {
    const data = apiResponseTimes[api];
    if (data.name !== undefined) {
      register.registerMetric(
        new client.Gauge({
          name: `${data.name}_max_response_time`,
          help: `${data.name} max response time`,
          collect() {
            const maxResponse = data.max;
            this.set(maxResponse);
          },
        }),
      );
    }
  }
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
