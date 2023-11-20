/* eslint-disable prefer-template */
import axios from 'axios';
import { getMetrics } from './parse.js';
import {
  MEASUREMENT, TOKEN, WRITE_API_URL, DB_START_DATE, SYSTEM_URL, APPLICATION_URL,
} from '../utils/influxdb-util.js';
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
  // eslint-disable-next-line quote-props
    headers: { 'Authorization': `Token ${TOKEN}` },
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
      timestamp = (match) ? match[1] * 1e9 : Date.now * 1e6; // 從reqpest per second 過來的時間是秒級，Date.now()是毫秒級
    }

    if (timestamp < DB_START_DATE) {
      return null;
    }
    return `${MEASUREMENT},item=${item.metricName}${tags ? ',' + tags : ''} ${fields} ${timestamp}`;
  }).filter((item) => item !== null).join('\n');

  await axios.post(WRITE_API_URL, appInflux, {
  // eslint-disable-next-line quote-props
    headers: { 'Authorization': `Token ${TOKEN}` },
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
