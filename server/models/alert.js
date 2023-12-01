/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';
import { fetchData } from './fetch.js';
import * as influxUtils from '../utils/influxdb-util.js';
import { sendEmail } from '../utils/email-util.js';
import { sendLineMessage } from '../utils/line-util.js';
import { sendMessageQueue } from '../utils/redis-util.js';

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

async function storeAlert(groupName, alert) {
  let influxQuery;
  const timestamp = Date.now() * 1e6;
  if (alert == null) {
    influxQuery = `${influxUtils.ALERT_MEASUREMENT},item=${groupName} startTime="NA",isFiring="false" ${timestamp}`;
  } else {
    influxQuery = `${influxUtils.ALERT_MEASUREMENT},item=${groupName} startTime="${alert.startTime}",isFiring="${alert.isFiring}" ${timestamp}`;
  }

  await axios.post(influxUtils.WRITE_API_URL, influxQuery, {
    headers: { Authorization: `Token ${influxUtils.TOKEN}` },
  })
    .then(() => {
      console.log('writing alerting db successfully!');
    })
    .catch((error) => console.error(error));
}

export async function checkAlerts(alertStates, timeRange, alertFile) {
  try {
    const { groups } = alertFile;

    if (groups.length === 0) return;

    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      const duration = parseTime(group.rules[0].for);

      const fluxQuery = `from(bucket: "${influxUtils.BUCKET}")
      |> range(start: -${timeRange})
      |> filter(${group.rules[0].expr})`;

      // eslint-disable-next-line no-await-in-loop
      const data = await fetchData(fluxQuery);

      if (data.length === 0) {
        alertStates[group.name] = null;
        storeAlert(group.name, alertStates[group.name]);
        sendMessageQueue();
        continue;
      }

      if (!alertStates[group.name]) {
        alertStates[group.name] = { startTime: data[0]._time, isFiring: 'pending' };
        storeAlert(group.name, alertStates[group.name]);
        sendMessageQueue();
      } else if (alertStates[group.name].isFiring !== 'true' && dateInterval(alertStates[group.name].startTime, data[data.length - 1]._time) >= duration) {
        alertStates[group.name].isFiring = 'true';
        storeAlert(group.name, alertStates[group.name]);
        sendMessageQueue();
        sendEmail(group.name, group.rules[0].expr);
        sendLineMessage(group.name, group.rules[0].expr);
      }
    }

  } catch (err) {
    console.log(err);
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
