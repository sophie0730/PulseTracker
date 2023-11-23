/* eslint-disable import/no-extraneous-dependencies */
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import { checkAlerts } from '../models/alert.js';

const CHECK_TIME_RANGE = '10s';
const TIMEOUT = 10000;

const alertFile = yaml.load(fs.readFileSync('./../yml/test.yml', 'utf-8'));
const alertStates = {};

function sendAlerts() {
  checkAlerts(alertStates, CHECK_TIME_RANGE, alertFile)
    .then(() => {
      setTimeout(sendAlerts, TIMEOUT);
    })
    .catch((error) => {
      console.error(error);
      setTimeout(sendAlerts, TIMEOUT);
    });
}

sendAlerts();
