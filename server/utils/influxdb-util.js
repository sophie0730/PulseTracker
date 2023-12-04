/* eslint-disable one-var-declaration-per-line */
/* eslint-disable one-var */
import { findUp } from 'find-up';
import dotenv from 'dotenv';

// eslint-disable-next-line import/no-mutable-exports
export let INFLUXDB_URL, ORG, BUCKET, MEASUREMENT, ALERT_MEASUREMENT, TOKEN, WRITE_API_URL;

(async () => {
  const dotenvPath = await findUp('.env');
  dotenv.config({ path: dotenvPath });

  INFLUXDB_URL = process.env.INFLUXDB_URL;
  ORG = process.env.ORG;
  BUCKET = process.env.BUCKET;
  MEASUREMENT = process.env.MEASUREMENT;
  ALERT_MEASUREMENT = process.env.ALERT_MEASUREMENT;
  TOKEN = process.env.TOKEN;
  WRITE_API_URL = `${process.env.INFLUXDB_URL}/api/v2/write?org=${process.env.ORG}&bucket=${process.env.BUCKET}&precision=ns`;
})();
