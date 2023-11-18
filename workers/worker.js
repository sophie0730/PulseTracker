import { client } from '../utils/influxdb-utils.js';
import { Point } from '@influxdata/influxdb-client';

const org = `AppWorks School`;
const bucket = `pulse_traker`;

let writeClient = client.getWriteApi(org, bucket, 'ns'); //ns: 寫入的精度(nano-second)

for (let i = 0; i < 5; i++) {
  const point = new Point('measurement1')
      .tag('tagname1', 'tagvalue1')
      .intField('field1', i)
  
    void setTimeout(() => {
      writeClient.writePoint(point)  //寫入point，資料存入緩存
    }, i * 1000) // separate points by 1 second
  
    void setTimeout(() => {
      writeClient.flush()  //將緩存倒入influxDB
    }, 5000)
  }

  const queryClient = client.getQueryApi(org)
  const fluxQuery = `from(bucket: "example03")
   |> range(start: -10m)
   |> filter(fn: (r) => r._measurement == "measurement1")`
  
  queryClient.queryRows(fluxQuery, {
    next: async (row, tableMeta) => {
      const tableObject = await tableMeta.toObject(row) //資料寫入db後回傳的資料
      console.log(tableObject)
    },
    error: (error) => {
      console.error('\nError', error)
    },
    complete: () => {
      console.log('\nSuccess')
    },
  })