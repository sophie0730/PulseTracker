import { InfluxDB } from '@influxdata/influxdb-client';
import * as influxUtils from '../utils/influxdb-util.js';

export async function fetchData(fluxQuery) {
  const client = new InfluxDB({ url: influxUtils.INFLUXDB_URL, token: influxUtils.TOKEN });
  const queryClient = client.getQueryApi(influxUtils.ORG);
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
        resolve(arr);
      },
    });
  });
  return data;
}

export default fetchData;
