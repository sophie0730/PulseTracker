import axios from 'axios';
import dotenv from 'dotenv';
import moment from 'moment';
import { getMetrics } from '../models/parse.js';

dotenv.config();

const INFLUXDB_URL = 'http://localhost:8086';
// const METRICS_URL = 'http://localhost:4000/metrics';

const SYSTEM_URL = 'http://172.21.73.153:9100/metrics';
const APPLICATION_URL = 'http://172.21.73.153:9101/metrics';

const ORG = 'personal';
const BUCKET = 'test';
const MEASUREMENT = 'test';
const TOKEN = '2FuGMAv_BBa4HM8r2V8OgdC1prwGagb8ARbHYRdii3_vLXp0QYL7aJoyF4oz_CMVOffIPPNdn3SAXy1E0CYW9g==';
const WRITE_API_URL = `${INFLUXDB_URL}/api/v2/write?org=${ORG}&bucket=${BUCKET}&precision=ns`;

async function storeData() {
  const systemMetrics = await getMetrics(SYSTEM_URL);
  const applicationMetrics = getMetrics(APPLICATION_URL);
  const systemInflux = systemMetrics.map((item) => {
    const tags = item.label ? `${item.label.trim().replace(/"/g, '')}` : '';
    const fields = `value=${item.value}`;
    const timestamp = Date.now() * 1e6; // 毫秒變奈秒
    // eslint-disable-next-line prefer-template
    return `${MEASUREMENT},item=${item.metricName}${tags ? ',' + tags : ''} ${fields} ${timestamp}`;
  }).join('\n');

  await axios.post(WRITE_API_URL, systemInflux, {
  // eslint-disable-next-line quote-props
    headers: { 'Authorization': `Token ${TOKEN}` },
  })
    .then(() => console.log('writing db successfully!'))
    .catch((error) => console.error(error));

}

setInterval(storeData, 10000);
