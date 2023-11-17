/* eslint-disable no-mixed-operators */
/* eslint-disable padded-blocks */
import * as fs from 'fs';
import * as readline from 'readline';
import dotenv from 'dotenv';

// import moment from 'moment';

dotenv.config();

const LOG_FILE_PATH = '/var/log/nginx/access.log';
// let inputStream = fs.createReadStream(LOG_FILE_PATH);
// let lineReader = readline.createInterface({input: inputStream});

export function getTotalRequest() {
  return new Promise((resolve, reject) => {
    const inputStream = fs.createReadStream(LOG_FILE_PATH);
    const lineReader = readline.createInterface({ input: inputStream });
    let httpTotalRequest = 0;
    lineReader.on('line', () => {
      httpTotalRequest++;
    });

    lineReader.on('close', () => {
      resolve(httpTotalRequest);
    });

    lineReader.on('error', (err) => {
      reject(err);
    });
  });
}

export async function getResponseTime() {
  return new Promise((resolve, reject) => {
    const inputStream = fs.createReadStream(LOG_FILE_PATH);
    const lineReader = readline.createInterface({ input: inputStream });
    const apiResponseTimes = {};

    lineReader.on('line', (line) => {
      const parts = line.split(' ');
      const apiEndpoint = parts[6]; // 6: api, 8: status code, 9: response time
      const responseTime = parseFloat(parts[9]);
      const statusCode = parts[8];

      if (!statusCode.startsWith('4') && !statusCode.startsWith('5') && apiEndpoint.startsWith('/api')) {
        if (!apiResponseTimes[apiEndpoint]) {
          apiResponseTimes[apiEndpoint] = {
            name: apiEndpoint.replace(/[^a-zA-Z0-9]/g, '_'),
            max: responseTime,
            total: responseTime,
            count: 1,
          };
        } else {
          apiResponseTimes[apiEndpoint].count += 1;
          apiResponseTimes[apiEndpoint].total += responseTime;
          apiResponseTimes[apiEndpoint].max = (responseTime > apiResponseTimes[apiEndpoint].max) ? responseTime : apiResponseTimes[apiEndpoint].max;
        }
      }
    });

    lineReader.on('close', () => {
      resolve(apiResponseTimes);
    });
    lineReader.on('error', (err) => {
      reject(err);
    });
  });
}

export async function getRequestPerSecond() {
  return new Promise((resolve, reject) => {
    const requestCounts = {};
    let currentSecond = null;
    let currentCount = 0;

    const inputStream = fs.createReadStream(LOG_FILE_PATH);
    const lineReader = readline.createInterface({ input: inputStream });

    lineReader.on('line', (line) => {
      const timestamp = line.match(/\[([^\]]+)\]/);
      if (timestamp) {
        // eslint-disable-next-line prefer-template
        const second = timestamp[1].split(' ')[0].split(':')[0] + 'T' + timestamp[1].split(' ')[0].split(':')[1] + ':' + timestamp[1].split(':')[2] + ':' + timestamp[1].split(':')[3].split(' ')[0];
        // const unixSecond = moment(second, 'DD/MMM/YYYYTHH:mm:ss').unix();

        if (second !== currentSecond) {
          if (currentSecond !== null) {
            requestCounts[currentSecond] = currentCount;
          }

          currentSecond = second;
          currentCount = 0;
        }
        currentCount++;
      }
    });

    lineReader.on('close', () => {
      resolve(requestCounts);
    });

    lineReader.on('error', (error) => {
      reject(error);
    });

  });
}
