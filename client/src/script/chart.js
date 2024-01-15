/* eslint-disable arrow-body-style */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
/* eslint-disable no-new */
import axios from 'axios';

function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const a = 0.5;

  return `rgba(${r}, ${g}, ${b}, ${a})`;

}

const options = {
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'minute',
        stepSize: 30,
        displayFormats: {
          minute: 'HH:mm',
        },
      },
      ticks: {
        maxRotation: 0,
      },
    },
  },
  elements: {
    point: {
      radius: 0,
    },
  },
};

const optionsBar = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const optionsBarWithTime = {
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'minute',
        // stepSize: 30,
        displayFormats: {
          minute: 'HH:mm',
        },
      },
      ticks: {
        maxRotation: 0,
      },
    },
    y: {
      beginAtZero: true,
    },
  },
};

const charts = {};

function groupByTag(data, tag) {
  return data.reduce((accumulator, entry) => {
    if (!accumulator[entry[tag]]) {
      accumulator[entry[tag]] = [];
    }
    accumulator[entry[tag]].push(entry);
    return accumulator;
  }, {});
}

function createDatasets(groupData, tag, type) {
  const groupKeys = Object.keys(groupData);

  return groupKeys.map((key) => ({
    label: type === 'line' ? `${tag} ${key}` : `${tag}`,
    data: groupData[key].map((entry) => entry._value),
    borderColor: type === 'line' ? getRandomColor() : undefined,
    borderWidth: 3,
    pointRadius: type === 'line' ? 0 : undefined,
    pointHoverRadius: type === 'line' ? 7 : undefined,
  }));
}

function getMaxValueDatasets(groupData, tag) {
  const groupKeys = Object.keys(groupData);
  const labelArr = [];
  const dataArr = [];
  const colorArr = [];

  groupKeys.forEach((key) => {
    const lastElement = groupData[key][groupData[key].length - 1];
    const color = getRandomColor();
    labelArr.push(key);
    dataArr.push(lastElement._value);
    colorArr.push(color);

  });

  return [{
    label: tag,
    data: dataArr,
    backgroundColor: colorArr,
    barThickness: 50,
  }];
}

export async function updateChart(item, time) {
  try {
    const chartId = item;
    const response = await axios.get(`${import.meta.env.VITE_HOST}/api/1.0/fetch/${item}?time=${time}`);
    const responseData = response.data;

    const times = responseData.map((element) => element._time);
    const values = responseData.map((element) => element._value);
    const tags = responseData.map((element) => element.tag);

    const { chart } = charts[chartId];

    chart.data.labels = times;

    if (tags && tags[0] !== undefined) {
      const tag = tags[0];
      const groupData = groupByTag(responseData, tag);

      chart.data.datasets.forEach((dataset) => {
        if (groupData[dataset.label]) {
          // eslint-disable-next-line no-param-reassign
          dataset.data = groupData[dataset.label].map((entry) => entry._value);
        }
      });
    } else {
      chart.data.datasets.forEach((dataset) => {
        // eslint-disable-next-line no-param-reassign
        dataset.data = values;
      });
    }

    chart.update();
  } catch (error) {
    console.error('Error updating chart:', error);
  }
}

export async function getChart(item, time, type) {
  const chartId = item;
  const response = await axios.get(`${import.meta.env.VITE_HOST}/api/1.0/fetch/${item}?time=${time}`);
  const responseData = response.data;

  const times = responseData.map((element) => element._time);
  const values = responseData.map((element) => element._value);
  const tags = responseData.map((element) => element.tag);

  const ctx = document.getElementById(`${item}-${type}`).getContext('2d');

  let datasets = [];
  let groupData = {};

  if (tags && tags[0] !== undefined) {
    const tag = tags[0];

    groupData = groupByTag(responseData, tag);
    datasets = createDatasets(groupData, tag, type);
  } else {
    datasets = [{
      label: `${item}`,
      data: values,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 3,
      lineTension: 0,
      pointRadius: 0,
      pointHoverRadius: 7,
    }];
  }

  if (item.includes('Max')) {
    datasets = getMaxValueDatasets(groupData, tags[0]);
  }

  if (charts[chartId]) {
    charts[chartId].chart.destroy();
  }

  const data = {
    labels: type === 'bar-group' && item.includes('Max') ? Object.keys(groupData) : times,
    datasets,
  };
  const chartType = type === 'line' ? 'line' : 'bar';
  // eslint-disable-next-line no-nested-ternary
  const chartOptions = type === 'line' ? options : type === 'bar-time' ? optionsBarWithTime : optionsBar;

  const chart = new Chart(ctx, {
    type: chartType,
    data,
    options: chartOptions,
  });

  charts[chartId] = {
    chart,
    type,
  };

}
