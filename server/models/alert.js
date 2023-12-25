/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';
import { fetchData } from './fetch.js';
import * as influxUtils from '../utils/influxdb-util.js';
import { sendEmail } from '../utils/email-util.js';
import { sendLineMessage } from '../utils/line-util.js';
import { publishUpdateMessage } from '../utils/redis-util.js';

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

async function storeAlert(alerts) {
  const storeQuery = alerts.map((alert) => {
    const timestamp = Date.now() * 1e6;

    if (alert.value === null) {
      return `${influxUtils.ALERT_MEASUREMENT},item=${alert.groupName} startTime="NA",isFiring="false" ${timestamp}`;
    }
    return `${influxUtils.ALERT_MEASUREMENT},item=${alert.groupName} startTime="${alert.value.startTime}",isFiring="${alert.value.isFiring}" ${timestamp}`;
  }).join('\n');

  await axios.post(influxUtils.WRITE_API_URL, storeQuery, {
    headers: { Authorization: `Token ${influxUtils.TOKEN}` },
  });
}

export async function checkAlerts(alertStates, timeRange, alertFile) {
  try {
    if (!alertFile) return;
    const { groups } = alertFile;

    if (groups.length === 0 || groups[0].name === null) return;

    const alertsArr = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const group of groups) {
      const duration = parseTime(group.rules[0].for);
      const fluxQuery = `from(bucket: "${influxUtils.BUCKET}")
      |> range(start: -${timeRange})
      |> filter(${group.rules[0].expr})`;

      const data = await fetchData(fluxQuery);

      let startTime = '';
      let endTime = '';

      if (data.length === 0) {
        alertStates[group.name] = null;
        alertsArr.push({ groupName: group.name, value: alertStates[group.name] });
        continue;
      }

      if (!alertStates[group.name]) {
        alertStates[group.name] = { startTime: data[0]._time, isFiring: 'pending' };
        alertsArr.push({ groupName: group.name, value: alertStates[group.name] });
        startTime = alertStates[group.name].startTime;
        endTime = data[data.length - 1]._time;
      } else if (alertStates[group.name].isFiring !== 'true' && dateInterval(startTime, endTime) >= duration) {
        alertStates[group.name].isFiring = 'true';
        alertsArr.push({ groupName: group.name, value: alertStates[group.name] });
        sendEmail(group.name, group.rules[0].expr);
        sendLineMessage(group.name, group.rules[0].expr);
      }
    }

    if (alertsArr.length > 0) {
      await storeAlert(alertsArr);
      await publishUpdateMessage();
    }
  } catch (error) {
    console.error({ path: error.path, message: error.message });
  }
}

export async function fetchAlertStatus(group) {
  const fetchAlertQuery = `from(bucket: "${influxUtils.BUCKET}")
  |> range(start: -14d)
  |> filter(fn: (r) => r._measurement == "${influxUtils.ALERT_MEASUREMENT}")
  |> filter(fn: (r) => r.item == "${group.name}")
  |> last()
  `;
  const alertStatus = await fetchData(fetchAlertQuery);
  return alertStatus;

}
