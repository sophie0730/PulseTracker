import * as chart from './chart.js';

async function getDashboard() {
  await Promise.all([
    chart.getCPUChart('3h'),
    chart.getMemoryChart('3h'),
    chart.getDiskReadChart('3h'),
    chart.getDiskWriteChart('3h'),
    chart.getTotalRequestChart('3h'),
    chart.getMaxResponseChart('3h'),
    chart.getCPULoad1m('3h'),
    chart.getCPULoad1m('3h'),
    chart.getCPULoad5m('3h'),
    chart.getCPULoad15m('3h'),
  ]);
}

await getDashboard();
