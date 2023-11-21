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

async function updateDashboard(timeRange) {
  await Promise.all([
    chart.getCPUChart(timeRange),
    chart.getMemoryChart(timeRange),
    chart.getDiskReadChart(timeRange),
    chart.getDiskWriteChart(timeRange),
    chart.getTotalRequestChart(timeRange),
    chart.getCPULoad1m(timeRange),
    chart.getCPULoad5m(timeRange),
    chart.getCPULoad15m(timeRange),
    chart.getRequestSecondChart(timeRange),
  ]);
}
// socket for auto generation page
const SOCKET_URL = 'http://localhost:4000';

window.updateTimeRange = async function() {
  const selectedTimeRange = document.getElementById('timeRangeSelect').value;
  console.log(selectedTimeRange);
  await updateDashboard(selectedTimeRange);
};

// eslint-disable-next-line no-undef
const socket = io(SOCKET_URL, {
  withCredentials: true,
});

socket.on('connect', () => {
  console.log('connected');
});
socket.on('dataUpdate', async () => {
  console.log('client received');
  await updateDashboard();
});
socket.on('error', (err) => {
  console.error('Connection Error:', err);
});

await getDashboard();
