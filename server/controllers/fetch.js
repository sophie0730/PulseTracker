import { BUCKET, MEASUREMENT } from '../utils/influxdb-util.js';
import { serverUrlArr } from '../utils/yml-util.js';
import { fetchData } from '../models/fetch.js';

// const GROUP_BY_CLAUSE = `
// |> aggregateWindow(every: 10s, fn: mean)
// `;
// const GROUP_BY_CLAUSE = '';

// export async function fetchCPU(req, res) {
//   try {
//     const { time } = req.query;
//     let fluxQuery = `from(bucket: "${BUCKET}")
//     |> range(start: -${time})
//     |> filter(fn: (r) => r.item == "cpu_average_usage")`;

//     if (!time.includes('s')) {
//       fluxQuery += GROUP_BY_CLAUSE;
//     }

//     const data = await fetchData(fluxQuery);
//     res.json(data);
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function fetchMemory(req, res) {
//   try {
//     const { time } = req.query;
//     let fluxQuery = `from(bucket: "${BUCKET}")
//     |> range(start: -${time})
//     |> filter(fn: (r) => r.item == "memory_usage")`;

//     if (!time.includes('s')) {
//       fluxQuery += GROUP_BY_CLAUSE;
//     }

//     const data = await fetchData(fluxQuery);
//     res.json(data);
//   } catch (error) {
//     console.log(error);
//   }

// }

// export async function fetchDisk(req, res) {
//   try {
//     const { type } = req.params;
//     const { time } = req.query;
//     // const { device } = req.query;
//     let fluxQuery = `from(bucket: "${BUCKET}")
//     |> range(start: -${time})
//     |> filter(fn: (r) => r.item == "disk_${type}_average_time")`;

//     if (!time.includes('s')) {
//       fluxQuery += GROUP_BY_CLAUSE;
//     }

//     const data = await fetchData(fluxQuery);
//     res.json(data);
//   } catch (error) {
//     console.error(error);
//   }
// }

// export async function fetchHttpRequest(req, res) {
//   try {
//     const { time } = req.query;
//     let fluxQuery = `from(bucket: "${BUCKET}")
//     |> range(start: -${time})
//     |> filter(fn: (r) => r.item == "http_total_requests")`;

//     if (!time.includes('s')) {
//       fluxQuery += GROUP_BY_CLAUSE;
//     }

//     const data = await fetchData(fluxQuery);
//     res.json(data);
//   } catch (error) {
//     console.error(error);
//   }
// }

// export async function fetchResponse(req, res) {
//   try {
//     const { time } = req.query;
//     const fluxQuery = `from(bucket: "${BUCKET}")
//     |> range(start: -${time})
//     |> filter(fn: (r) => r.item == "max_response_time")
//     |> last()
//     `;

//     const data = await fetchData(fluxQuery);
//     res.json(data);
//   } catch (error) {
//     console.error(error);
//   }
// }

// export async function fetchRequestSecond(req, res) {
//   try {
//     const { time } = req.query;
//     const fluxQuery = `from(bucket: "${BUCKET}")
//     |> range(start: -${time})
//     |> filter(fn: (r) => r.item == "request_per_second")`;

//     const data = await fetchData(fluxQuery);
//     res.json(data);
//   } catch (error) {
//     console.error(error);
//   }
// }

// export async function fetchCPULoad(req, res) {
//   try {
//     const { time } = req.query;
//     const { loadTime } = req.params;
//     let fluxQuery = `from(bucket: "${BUCKET}")
//     |> range(start: -${time})
//     |> filter(fn: (r) => r.item == "load_duration_${loadTime}m")`;

//     if (!time.includes('s')) {
//       fluxQuery += GROUP_BY_CLAUSE;
//     }

//     const data = await fetchData(fluxQuery);
//     res.json(data);
//   } catch (error) {
//     console.error(error);
//     res.json(error);
//   }
// }

export async function fetchAllItems(req, res) {
  try {
    const items = await fetchData(`from(bucket: "${BUCKET}")
    |> range(start: -14d)
    |> filter(fn: (r) => r._measurement == "${MEASUREMENT}")
    |> keep(columns: ["item"])
    |> distinct(column: "item")
    `);
    // const items = await fetchData(`from(bucket: "${BUCKET}")
    // |> range(start: -${time})
    // |> filter(fn: (r) => r._measurement == "${MEASUREMENT}")
    // `);
    res.json(items);
  } catch (error) {
    console.error(error);
  }
}

export async function fetchDataByItems(req, res) {
  const { item } = req.params;
  const { time } = req.query;

  const fluxQuery = `from(bucket: "${BUCKET}")
  |> range(start: -${time})
  |> filter(fn: (r) => r.item == "${item}")`;
  const responseDataArr = [];
  const data = await fetchData(fluxQuery);
  data.forEach((record) => {
    const tag = Object.keys(record).filter((key) => (
      !['_start', '_stop', '_time', '_value', '_field', '_measurement', 'result', 'item'].includes(key) && typeof record[key] === 'string'
    ));
    // eslint-disable-next-line prefer-destructuring, no-param-reassign
    record.tag = tag[0];
    responseDataArr.push(record);
  });
  res.json(responseDataArr);
}

function createTargetQuery(bucket, measurment, targetUrl, field) {
  return `from(bucket: "${bucket}")
  |> range(start: -14d)
  |> filter(fn: (r) => r._measurement == "${measurment}")
  |> filter(fn: (r) => r.item == "up")
  |> filter(fn: (r) => r.target == "${targetUrl}")
  |> filter(fn: (r) => r._field == "${field}")
  |> last()`;
}

function getTimeInterval(startTime, endTime) {
  const nowDate = new Date(endTime);
  const recordDate = new Date(startTime);
  return (nowDate.getTime() - recordDate.getTime()) / 1000;
}

export async function fetchTargets(req, res) {
  try {
    const dataArr = [];
    // eslint-disable-next-line no-restricted-syntax
    for await (const item of serverUrlArr) {
      const targetHost = item.static_configs.targets;
      const targetProtocol = item.scheme;
      const targetPath = (item.metrics_path === undefined) ? '' : item.metrics_path;
      const targetUrl = `${targetProtocol}://${targetHost}${targetPath}`;

      const fluxQuery = createTargetQuery(BUCKET, MEASUREMENT, targetUrl, 'value');
      const errorQuery = createTargetQuery(BUCKET, MEASUREMENT, targetUrl, 'error');

      const data = await fetchData(fluxQuery);
      if (data[0]._value === 1) {
        const lastScrape = getTimeInterval(data[0]._time, Date.now());
        data[0].lastScrape = `${lastScrape}s ago`;
        dataArr.push(data[0]);
      } else {
        const error = await fetchData(errorQuery);
        const lastScrape = getTimeInterval(error[0]._time, Date.now());
        error[0].lastScrape = `${lastScrape}s ago`;
        dataArr.push(error[0]);
      }
    }
    res.json(dataArr);
  } catch (error) {
    console.error(error);
  }
}

export default fetchTargets;
