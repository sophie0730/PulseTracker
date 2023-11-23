/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
import { BUCKET } from '../utils/influxdb-util.js';
import { fetchData } from './fetch.js';
import { storeAlert } from './store.js';

function parseTime(durationStr) {
  const match = durationStr.match(/^(\d+)(m|s|h|d)$/);
  const value = match[1];
  const unit = match[2];
  let parsedTime; // 先換成秒級

  switch (unit) {
    case 's':
      parsedTime = value;
      break;
    case 'm':
      parsedTime = value * 60;
      break;
    case 'h':
      parsedTime = value * 60 * 60;
      break;
    case 'd':
      parsedTime = value * 24 * 60 * 60;
      break;
    default:
      break;
  }

  const msTime = parsedTime * 1000;
  return msTime;
}

function dateInterval(startTimeStr, endTimeStr) {
  const startTime = new Date(startTimeStr);
  const endTime = new Date(endTimeStr);

  return endTime - startTime;
}

export async function checkAlerts(alertStates, timeRange, alertFile) {
  try {
    const { groups } = alertFile;

    if (groups.length === 0) return;

    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      const duration = parseTime(group.rules[0].for);

      const fluxQuery = `from(bucket: "${BUCKET}")
      |> range(start: -${timeRange})
      |> filter(${group.rules[0].expr})`;

      // eslint-disable-next-line no-await-in-loop
      const data = await fetchData(fluxQuery);

      if (data.length === 0) {
        alertStates[group.name] = null;
        storeAlert(group.name, alertStates[group.name]);
        continue;
      }
      if (alertStates[group.name]) {
        console.log(dateInterval(alertStates[group.name].startTime, data[data.length - 1]._time));
      }

      if (!alertStates[group.name]) {
        alertStates[group.name] = { startTime: data[0]._time, isFiring: false };
        storeAlert(group.name, alertStates[group.name]);
      } else if (dateInterval(alertStates[group.name].startTime, data[data.length - 1]._time) >= duration) {
        alertStates[group.name].isFiring = true;
        storeAlert(group.name, alertStates[group.name]);
      }

    }

  } catch (err) {
    console.log(err);
  }
}

export default { checkAlerts };
