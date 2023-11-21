/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/extensions */
import express from 'express';
import cors from 'cors';
import * as client from 'prom-client';
import moment from 'moment';
import * as calculate from '../models/application-calculate.js';
import { BUCKET } from '../utils/influxdb-util.js';
import { fetchData } from '../models/fetch.js';

const app = express();
app.use(express.json());
app.use(cors());

const register = new client.Registry();
const { collectDefaultMetrics } = client;

collectDefaultMetrics({
  app: 'node-exporter-2.0',
  timeout: 10000,
  gcDurationBuckets: [1, 2, 5, 7, 9],
  register,
});

const httpTotalRequest = new client.Gauge({
  name: 'http_total_requests',
  help: 'http total request',
});

const guageRequestPerSecond = new client.Gauge({
  name: 'request_per_second',
  help: 'Request per second',
  labelNames: ['time'],
});

const guageResponseTime = new client.Gauge({
  name: 'max_response_time',
  help: 'max response time',
  labelNames: ['api'],
});

register.registerMetric(httpTotalRequest);
register.registerMetric(guageResponseTime);
register.registerMetric(guageRequestPerSecond);

async function setMetrics() {
  const totalRequest = await calculate.getTotalRequest();
  httpTotalRequest.set(totalRequest);

  const apiResponseTimes = await calculate.getResponseTime();

  for (const api in apiResponseTimes) {
    const data = apiResponseTimes[api];
    if (data.name !== undefined) {
      guageResponseTime.set({ api: data.name }, data.max);
    }
  }

  const fluxQuery = `from(bucket: "${BUCKET}")
  |> range(start: -1d)
  |> filter(fn: (r) => r.item == "request_per_second")
  |> last()
  `;
  const lastData = await fetchData(fluxQuery);
  const lastTime = lastData[0]._time;
  console.log(lastTime);
  const unixLastTime = moment(lastTime, 'YYYY-MM-DDTHH:mm:ssZ').unix();
  console.log(unixLastTime);
  const requestsPerSecond = await calculate.getRequestPerSecond();
  for (const second in requestsPerSecond) {
    const count = requestsPerSecond[second];
    // 和db最後一筆比對
    console.log(second);
    if (second <= unixLastTime) continue;
    guageRequestPerSecond.set({ time: second }, count);
  }
}

app.get('/metrics', async (req, res) => {
  try {
    await setMetrics();
    res.set('Content-Type', register.contentType);
    res.send(await register.metrics());
  } catch (error) {
    console.error(error);
    res.status(500).send('Error setting up metrics');
  }
});

app.listen(9101, () => {
  console.log('The port in openning in 9101');
});
