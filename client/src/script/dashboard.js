import axios from 'axios';
import * as chart from './chart.js';

async function getDashboard() {
  try {
    const fetchItemsAPI = 'http://localhost:4000/api/1.0/fetchItems';
    const response = await axios.get(fetchItemsAPI);
    const results = response.data;
    results.forEach((result) => {
      chart.getChart(result.item, '30m');
    });
  } catch (error) {
    console.error(error);
  }
  // await Promise.all([
  //   chart.getCPUChart('30m'),
  //   chart.getMemoryChart('30m'),
  //   chart.getDiskReadChart('30m'),
  //   chart.getDiskWriteChart('30m'),
  //   chart.getTotalRequestChart('30m'),
  //   chart.getMaxResponseChart('14d'),
  //   chart.getCPULoad1m('30m'),
  //   chart.getCPULoad5m('30m'),
  //   chart.getCPULoad15m('30m'),
  //   chart.getRequestSecondChart('30m'),
  // ]);
}

export async function updateDashboard(timeRange) {
  try {
    const fetchItemsAPI = 'http://localhost:4000/api/1.0/fetchItems';
    const response = await axios.get(fetchItemsAPI);
    const results = response.data;
    window.onload = async () => {
      // eslint-disable-next-line no-restricted-syntax
      for (const result of results) {
        // eslint-disable-next-line no-await-in-loop
        await chart.getChart(result.item, timeRange);
      }
    };

  } catch (error) {
    console.error(error);
  }
  // await Promise.all([
  //   chart.getCPUChart(timeRange),
  //   chart.getMemoryChart(timeRange),
  //   chart.getDiskReadChart(timeRange),
  //   chart.getDiskWriteChart(timeRange),
  //   chart.getTotalRequestChart(timeRange),
  //   chart.getCPULoad1m(timeRange),
  //   chart.getCPULoad5m(timeRange),
  //   chart.getCPULoad15m(timeRange),
  //   chart.getRequestSecondChart(timeRange),
  // ]);
}

// socket for auto generation page
// const SOCKET_URL = 'http://localhost:4000';

// eslint-disable-next-line no-undef
// const socket = io(SOCKET_URL, {
//   withCredentials: true,
// });

// socket.on('connect', () => {
//   console.log('connected');
// });
// socket.on('dataUpdate', async () => {
//   console.log('client received');
//   await updateDashboard(selectedTimeRange);
// });
// socket.on('error', (err) => {
//   console.error('Connection Error:', err);
// });

getDashboard();

export default updateDashboard;
