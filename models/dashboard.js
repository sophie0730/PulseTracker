import * as chart from './chart.js';

async function getDashboard() {
  await chart.getCPUChart('3h');
  await chart.getMemoryChart('3h');
  await chart.getDiskReadChart('3h');
  await chart.getDiskWriteChart('3h');
  await chart.getTotalRequestChart('3h');
  await chart.getMaxResponseChart('3h');
  await chart.getCPULoad1m('3h');
  await chart.getCPULoad5m('3h');
  await chart.getCPULoad15m('3h');
}

await getDashboard();
