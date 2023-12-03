import axios from 'axios';
import * as chart from './chart.js';

async function getDashboard() {
  try {
    const fetchItemsAPI = 'http://localhost:4000/api/1.0/fetchItems';
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
}

getDashboard();

export default updateDashboard;
