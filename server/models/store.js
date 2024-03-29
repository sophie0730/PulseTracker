/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/first */
/* eslint-disable prefer-template */
import axios from 'axios';
import { getMetrics } from './parse.js';
import {
  WRITE_API_URL, TOKEN, MEASUREMENT,
} from '../utils/influxdb-util.js';
import { serverUrlArr } from '../utils/yml-util.js';
import { publishGraphUpdate, publishTargetUpdate } from '../utils/redis-util.js';

async function storeMetrices(targetUrl) {
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
  });

  await publishGraphUpdate();
}

async function storeStatus(targetUrl, targetName) {
  let errorResponse = '';

  const targetStatus = await axios.get(targetUrl)
    .then((response) => response.status)
    .catch((error) => {
      console.error({ path: error.path, message: error.message });
      errorResponse = error;
    });

  const up = (targetStatus === 200) ? 1 : 0;
  const timestamp = Date.now() * 1e6;
  const statusFlux = `${MEASUREMENT},item=up,target=${targetUrl},name=${targetName} value=${up},error="${errorResponse}"  ${timestamp}`;

  axios.post(WRITE_API_URL, statusFlux, {
    headers: { Authorization: `Token ${TOKEN}` },
  });
}

function handleError(error) {
  console.error({ path: error.path, message: error.message });
}

function constructTargetUrl(item) {
  const targetHost = item.static_configs.targets;
  const targetProtocol = item.scheme;
  const targetPath = (item.metrics_path === undefined) ? '' : item.metrics_path;
  return `${targetProtocol}://${targetHost}${targetPath}`;
}

export async function storeExporterStatus() {
  try {
    for (const item of serverUrlArr) {
      const targetUrl = constructTargetUrl(item);
      const targetName = item.job_name;

      storeStatus(targetUrl, targetName);
      await publishTargetUpdate();
    }
  } catch (error) {
    handleError(error);
  }
}

export async function storeExporterMetrices() {
  try {
    const targetUrls = serverUrlArr.filter((server) => server.job_name !== 'pulsetracker_server');

    for (const item of targetUrls) {
      const targetUrl = constructTargetUrl(item);
      storeMetrices(targetUrl);
    }
  } catch (error) {
    handleError(error);
  }
}
