/* eslint-disable no-restricted-globals */
/* eslint-disable import/no-extraneous-dependencies */
import { checkAlerts } from '../models/alert.js';
import { alertFile, alertTimeout } from '../utils/yml-util.js';

const CHECK_TIME_RANGE = `${(alertTimeout + 5).toString()}s`;
const TIMEOUT = alertTimeout * 1000; // unit: second

const alertStates = {};

function sendAlerts() {
  checkAlerts(alertStates, CHECK_TIME_RANGE, alertFile)
    .then(() => {
      console.log('writting alert success');
      setTimeout(sendAlerts, TIMEOUT);
    })
    .catch((error) => {
      console.error(error);
      setTimeout(sendAlerts, TIMEOUT);
    });
}

sendAlerts();

// function sendHeartbeat() {
//   process.send({ type: 'heartbeat' });
// }

// setInterval(sendHeartbeat, TIMEOUT);
