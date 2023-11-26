import dotenv from 'dotenv';
import moment from 'moment';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { configFile } from './yml-util.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: `${__dirname}/../.env` });

export const {
  INFLUXDB_URL, ORG, BUCKET, MEASUREMENT, ALERT_MEASUREMENT, TOKEN,
} = process.env;
export const WRITE_API_URL = `${process.env.INFLUXDB_URL}/api/v2/write?org=${process.env.ORG}&bucket=${process.env.BUCKET}&precision=ns`;
export const DB_START_DATE = moment('17/NOV/2023T20:00:00', 'DD/MMM/YYYYTHH:mm:ss').unix() * 1e6;

console.log(configFile);
