// repl.repl.ignoreUndefined=true
import dotenv from 'dotenv';
import moment from 'moment';
// import { InfluxDB } from '@influxdata/influxdb-client';

dotenv.config();

export const INFLUXDB_URL = 'http://localhost:8086';

export const ORG = 'personal';
export const BUCKET = 'test';
export const MEASUREMENT = 'test';
export const TOKEN = '2FuGMAv_BBa4HM8r2V8OgdC1prwGagb8ARbHYRdii3_vLXp0QYL7aJoyF4oz_CMVOffIPPNdn3SAXy1E0CYW9g==';
export const WRITE_API_URL = `${INFLUXDB_URL}/api/v2/write?org=${ORG}&bucket=${BUCKET}&precision=ns`;
export const DB_START_DATE = moment('17/NOV/2023T20:00:00', 'DD/MMM/YYYYTHH:mm:ss').unix() * 1e6;

export const SYSTEM_URL = 'http://172.21.73.153:9100/metrics';
export const APPLICATION_URL = 'http://172.21.73.153:9101/metrics';
