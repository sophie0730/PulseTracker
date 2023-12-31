/* eslint-disable no-await-in-loop */
import { BUCKET, MEASUREMENT } from '../utils/influxdb-util.js';
import { serverUrlArr } from '../utils/yml-util.js';
import { fetchData } from '../models/fetch.js';

export async function fetchAllItems(req, res) {
  try {
    const items = await fetchData(`from(bucket: "${BUCKET}")
    |> range(start: -14d)
    |> filter(fn: (r) => r._measurement == "${MEASUREMENT}")
    |> keep(columns: ["item"])
    |> distinct(column: "item")
    `);

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message, stack: error.stack });
  }
}

export async function fetchDataByItems(req, res) {
  try {
    const { item } = req.params;
    const { time } = req.query;

    const fluxQuery = `from(bucket: "${BUCKET}")
    |> range(start: -${time})
    |> filter(fn: (r) => r.item == "${item}")`;

    const keyArr = ['_start', '_stop', '_time', '_value', '_field', '_measurement', 'result', 'item'];

    const responseDataArr = [];
    const data = await fetchData(fluxQuery);
    data.forEach((record) => {
      const tag = Object.keys(record).filter((key) => (
        !keyArr.includes(key) && typeof record[key] === 'string'
      ));
      // eslint-disable-next-line prefer-destructuring, no-param-reassign
      record.tag = tag[0];
      responseDataArr.push(record);
    });
    res.json(responseDataArr);
  } catch (error) {
    res.status(500).json({ message: error.message, stack: error.stack });
  }
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
    for (const item of serverUrlArr) {
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
    res.status(500).json({ message: error.message, stack: error.stack });
  }
}
