import * as chart from './chart.js';

async function getDashboard() {
  await Promise.all([
    chart.getCPUChart('1h'),
    chart.getMemoryChart('1h'),
    chart.getDiskReadChart('1h'),
    chart.getDiskWriteChart('1h'),
    chart.getTotalRequestChart('1h'),
    chart.getMaxResponseChart('14d'),
    chart.getCPULoad1m('1h'),
    chart.getCPULoad5m('1h'),
    chart.getCPULoad15m('1h'),
    chart.getRequestSecondChart('1h'),
  ]);
}
// socket for auto generation page
const SOCKET_URL = 'http://localhost:4000';

// eslint-disable-next-line no-undef
const socket = io(SOCKET_URL, {
  withCredentials: true,
});

socket.on('connect', () => {
  console.log('connected');
});
socket.on('dataUpdate', async () => {
  console.log('client received');
  await getDashboard();
});
socket.on('error', (err) => {
  console.error('Connection Error:', err);
});

await getDashboard();
