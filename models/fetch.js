import { InfluxDB } from '@influxdata/influxdb-client';
import {
  INFLUXDB_URL, TOKEN, ORG,
} from '../utils/influxdb-utils.js';

export async function fetchData(fluxQuery) {
  const client = new InfluxDB({ url: INFLUXDB_URL, token: TOKEN });
  const queryClient = client.getQueryApi(ORG);
  const arr = [];
  const data = await new Promise((resolve, reject) => {
    queryClient.queryRows(fluxQuery, {
      next: (row, tableMeta) => {
        const tableObject = tableMeta.toObject(row);
        arr.push(tableObject);
      },

      error: (error) => {
        reject(error);
      },

      complete: () => {
        console.log('\nSuccess');
        resolve(arr);
      },
    });
  });
  return data;
}

export default fetchData;
