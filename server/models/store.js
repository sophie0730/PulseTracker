/* eslint-disable no-restricted-syntax */
/* eslint-disable import/first */
/* eslint-disable prefer-template */
import axios from 'axios';
import { getMetrics } from './parse.js';
import {
  WRITE_API_URL, TOKEN, MEASUREMENT,
} from '../utils/influxdb-util.js';
import { serverUrlArr } from '../utils/yml-util.js';
import { sendMessageQueue } from '../utils/redis-util.js';

async function storeMetrices(targetUrl) {
  try {
    const metrices = await getMetrics(targetUrl);
    const storeQuery = metrices.map((item) => {
      let timestamp = Date.now() * 1e6; // 毫秒級變奈秒級
      const tags = (item.label && !item.label.startsWith('time=')) ? `${item.label.trim().replace(/"/g, '')}` : '';
      const fields = `value=${item.value}`;

      if (item.label.startsWith('time=')) {
        const timeStr = item.label;
        const match = timeStr.match(/time="(\d+)"/);
        timestamp = (match) ? match[1] * 1e9 : Date.now() * 1e6;
      }

      return `${MEASUREMENT},item=${item.metricName}${tags ? ',' + tags : ''} ${fields} ${timestamp}`;
    }).filter((item) => item !== null).join('\n');

    await axios.post(WRITE_API_URL, storeQuery, {
      headers: { Authorization: `Token ${TOKEN}` },
    })
      .then(() => {
        console.log('Writing data to DB successfully!');
      });
  } catch (error) {
    console.error(error);
  }

}

async function storeStatus(targetUrl, targetName) {
  let errorResponse = '';
  const targetStatus = await axios.get(targetUrl)
    .then((response) => response.status)
    .catch((error) => {
      console.error(error);
      errorResponse = error;
    });

  const up = (targetStatus === 200) ? 1 : 0;
  const timestamp = Date.now() * 1e6;
  const statusFlux = `${MEASUREMENT},item=up,target=${targetUrl},name=${targetName} value=${up},error="${errorResponse}"  ${timestamp}`;
  axios.post(WRITE_API_URL, statusFlux, {
    headers: { Authorization: `Token ${TOKEN}` },
  })
    .catch((error) => console.error(error));
}

export async function storeExporterStatus() {
  for await (const item of serverUrlArr) {
    const targetHost = item.static_configs.targets;
    const targetProtocol = item.scheme;
    const targetPath = (item.metrics_path === undefined) ? '' : item.metrics_path;
    // eslint-disable-next-line no-await-in-loop
    const targetUrl = `${targetProtocol}://${targetHost}${targetPath}`;
    const targetName = item.job_name;

    storeStatus(targetUrl, targetName);
    sendMessageQueue();
  }
}

export async function storeExporterMetrices() {
  const targetUrls = serverUrlArr.filter((server) => server.job_name !== 'pulsetracker_server');
  for await (const item of targetUrls) {
    const targetHost = item.static_configs.targets;
    const targetProtocol = item.scheme;
    const targetPath = (item.metrics_path === undefined) ? '' : item.metrics_path;
    // eslint-disable-next-line no-await-in-loop
    const targetUrl = `${targetProtocol}://${targetHost}${targetPath}`;

    storeMetrices(targetUrl);
  }
}
