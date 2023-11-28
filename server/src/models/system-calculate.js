/* eslint-disable object-curly-newline */
import * as os from 'os';
import { exec } from 'child_process';

export function getCPUInfo() {
  const cpus = os.cpus();
  let idleTotal = 0;
  let total = 0;

  // eslint-disable-next-line no-restricted-syntax
  for (const cpu of cpus) {
    const { user, nice, sys, idle, irq } = cpu.times;
    idleTotal += idle;

    total += user + nice + sys + idle + irq;
  }
  const CPUsage = (1 - idleTotal / total) * 100;

  return Math.round(CPUsage * 100) / 100;
}

export function getMemoryUsage() {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;

  const memoryUsage = ((usedMem / totalMem) * 100);

  return Math.round(memoryUsage * 100) / 100;
}

function parseDiskData(data) {
  const parseData = data.sysstat.hosts[0].statistics[0].disk;
  return parseData;
}

export async function getDiskInfo() {
  return new Promise((resolve, reject) => {
    const diskInfo = [];
    let readTotal = 0;
    let writeTotal = 0;
    let deviceTotal = 0;
    exec('iostat -xd -o JSON', (error, stdout, stderr) => {
      if (error) {
        reject(error.message);
        console.error(error.message);
      }

      if (stderr) {
        console.log(error);
      }
      const data = JSON.parse(stdout);
      const parseData = parseDiskData(data);
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const item of parseData) {
        const info = {
          diskDevice: item.disk_device,
          readAwait: item.r_await,
          writeAwait: item.w_await,
        };
        diskInfo.push(info);
        readTotal += item.r_await;
        writeTotal += item.w_await;
        deviceTotal++;
      }

      const total = {
        diskDevice: 'total',
        readAwait: Math.round((readTotal / deviceTotal) * 100) / 100,
        writeAwait: Math.round((writeTotal / deviceTotal) * 100) / 100,
      };
      diskInfo.push(total);
      resolve(diskInfo);
    });
  });
}
