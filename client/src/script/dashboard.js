import axios from 'axios';
import * as chart from './chart.js';

async function getDashboard() {
  try {
    const fetchItemsAPI = '/api/1.0/fetchItems';
    const response = await axios.get(fetchItemsAPI);
    const results = response.data;
    window.onload = async () => {
      // eslint-disable-next-line no-restricted-syntax
      for (const result of results) {
        // eslint-disable-next-line no-await-in-loop
        await chart.getChart(result.item, '30m');
      }
    };
  } catch (error) {
    console.error(error);
  }
}

export async function updateDashboard(timeRange) {
  try {
    const fetchItemsAPI = '/api/1.0/fetchItems';
    const response = await axios.get(fetchItemsAPI);
    const results = response.data;
    console.log(results);
    window.onload = async () => {
      // eslint-disable-next-line no-restricted-syntax
      for (const result of results) {
        // eslint-disable-next-line no-await-in-loop
        console.log(result);
        // eslint-disable-next-line no-await-in-loop
        await chart.getChart(result.item, timeRange);
      }
    };

  } catch (error) {
    console.error(error);
  }
}

getDashboard();

export default updateDashboard;
