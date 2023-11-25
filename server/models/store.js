/* eslint-disable import/first */
/* eslint-disable prefer-template */
import axios from 'axios';
import { getMetrics } from './parse.js';
import {
  SYSTEM_URL, WRITE_API_URL, TOKEN, APPLICATION_URL, MEASUREMENT, DB_START_DATE,
} from '../utils/influxdb-util.js';
import { serverUrlArr } from '../utils/yml-util.js';
import { client, SOCKET_KEY } from '../utils/redis-util.js';

export async function storeSystemData() {
  const systemMetrics = await getMetrics(SYSTEM_URL);
  const systemInflux = systemMetrics.map((item) => {
    const tags = item.label ? `${item.label.trim().replace(/"/g, '')}` : '';
    const fields = `value=${item.value}`;
    const timestamp = Date.now() * 1e6; // 毫秒變奈秒
    return `${MEASUREMENT},item=${item.metricName}${tags ? ',' + tags : ''} ${fields} ${timestamp}`;
  }).join('\n');

  await axios.post(WRITE_API_URL, systemInflux, {
    headers: { Authorization: `Token ${TOKEN}` },
  })
    .then(() => {
      console.log('writing system db successfully!');
      if (client.isReady) {
        client.rPush(SOCKET_KEY, 'data update');
        console.log('socket message sent');
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

export async function storeApplicationData() {
  const appMetrics = await getMetrics(APPLICATION_URL);

  const appInflux = appMetrics.map((item) => {
    let timestamp = Date.now() * 1e6;
    const tags = (item.label && !item.label.startsWith('time=')) ? `${item.label.trim().replace(/"/g, '')}` : '';
    const fields = `value=${item.value}`;
    if (item.label.startsWith('time=')) {
      const timeStr = item.label;
      const match = timeStr.match(/time="(\d+)"/);
      timestamp = (match) ? match[1] * 1e9 : Date.now() * 1e6; // 從reqpest per second 過來的時間是秒級，Date.now()是毫秒級
    }

    if (timestamp < DB_START_DATE) {
      return null;
    }
    return `${MEASUREMENT},item=${item.metricName}${tags ? ',' + tags : ''} ${fields} ${timestamp}`;
  }).filter((item) => item !== null).join('\n');

  await axios.post(WRITE_API_URL, appInflux, {
    headers: { Authorization: `Token ${TOKEN}` },
  })
    .then(() => {
      console.log('writing app db successfully!');
      if (client.isReady) {
        client.rPush(SOCKET_KEY, 'data update');
        console.log('socket message sent');
      }
    })
    .catch((error) => console.error(error));
}

export async function storeExporterStatus() {
  // eslint-disable-next-line no-restricted-syntax
  for await (const item of serverUrlArr) {
    const targetHost = item.static_configs.targets;
    const targetProtocol = item.scheme;
    const targetPath = (item.metrics_path === undefined) ? '' : item.metrics_path;
    // eslint-disable-next-line no-await-in-loop
    const targetUrl = `${targetProtocol}://${targetHost}${targetPath}`;

    let errorResponse = '';
    const targetStatus = await axios.get(targetUrl)
      .then((response) => response.status)
      .catch((error) => {
        console.error(error);
        errorResponse = error;
        return null;
      });

    const up = (targetStatus === 200) ? 1 : 0;
    const timestamp = Date.now() * 1e6;
    const statusFlux = `${MEASUREMENT},item=up,target=${targetHost} value=${up},error="${errorResponse}"  ${timestamp}`;
    axios.post(WRITE_API_URL, statusFlux, {
      headers: { Authorization: `Token ${TOKEN}` },
    })
      .catch((error) => console.error(error));
  }
}
