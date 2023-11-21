/* eslint-disable arrow-body-style */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
/* eslint-disable no-new */
import { mergeSort } from './sort.js';

const apiUrl = 'http://localhost:4000';

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
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

const charts = {};

export async function getCPUChart(time) {
  const chartId = 'Cpu';
  const response = await fetch(`${apiUrl}/api/1.0/cpu?time=${time}`);
  const cpus = await response.json();
  const times = cpus.map((cpu) => cpu._time);
  const values = cpus.map((cpu) => cpu._value);

  const ctx = document.getElementById('cpuUsageChart').getContext('2d');
  if (charts[chartId]) {
    charts[chartId].destroy();
  }

  charts[chartId] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: times,
      datasets: [{
        label: 'CPU Average Usage (%)',
        data: values,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 3,
        lineTension: 0,
        pointRadius: 0,
        pointHoverRadius: 7,
      }],
    },
    options,
  });
}

export async function getMemoryChart(time) {
  const chartId = 'Memory';
  const response = await fetch(`${apiUrl}/api/1.0/memory?time=${time}`);
  const memories = await response.json();
  const times = memories.map((memory) => memory._time);
  const values = memories.map((memory) => memory._value);

  const ctx = document.getElementById('memoryUsageChart').getContext('2d');

  if (charts[chartId]) {
    charts[chartId].destroy();
  }

  charts[chartId] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: times,
      datasets: [{
        label: 'Memory Usage (%)',
        data: values,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 3,
        lineTension: 0,
        pointRadius: 0,
        pointHoverRadius: 7,
      }],
    },
    options,
  });
}

export async function getDiskReadChart(time) {
  const chartId = 'DiskRead';
  const response = await fetch(`${apiUrl}/api/1.0/disk/read?time=${time}`);
  const rawData = await response.json();

  const groupData = rawData.reduce((accumulator, entry) => {
    if (!accumulator[entry.device]) {
      accumulator[entry.device] = [];
    }
    accumulator[entry.device].push(entry);
    return accumulator;
  }, {});

  const groupkeys = Object.keys(groupData);
  const datasets = groupkeys.map((device) => {
    return {
      label: `Device ${device}`,
      data: groupData[device].map((entry) => entry._value),
      fill: false,
      //   borderColor: color,
      // backgroundColor: getRandomColor(),
      borderColor: getRandomColor(),
      borderWidth: 3,
      pointRadius: 0,
      pointHoverRadius: 7,
    };
  });
  const ctx = document.getElementById('diskReadChart').getContext('2d');

  if (charts[chartId]) {
    charts[chartId].destroy();
  }

  charts[chartId] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: rawData.map((entry) => entry._time),
      datasets,
    },
    options,
  });
}

export async function getDiskWriteChart(time) {
  const chartId = 'DiskWrite';
  const response = await fetch(`${apiUrl}/api/1.0/disk/write?time=${time}`);
  const rawData = await response.json();

  const groupData = rawData.reduce((accumulator, entry) => {
    if (!accumulator[entry.device]) {
      accumulator[entry.device] = [];
    }
    accumulator[entry.device].push(entry);
    return accumulator;
  }, {});

  const groupKeys = Object.keys(groupData);
  const datasets = groupKeys.map((device) => {
    return {
      label: `Device ${device}`,
      data: groupData[device].map((entry) => entry._value),
      fill: false,
      // borderColor: color,
      // backgroundColor: getRandomColor(),
      borderColor: getRandomColor(),
      borderWidth: 3,
      pointRadius: 0,
      pointHoverRadius: 7,
    };
  });
  const ctx = document.getElementById('diskWriteChart').getContext('2d');

  if (charts[chartId]) {
    charts[chartId].destroy();
  }

  charts[chartId] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: rawData.map((entry) => entry._time),
      datasets,
    },
    options,
  });
}

export async function getTotalRequestChart(time) {
  const chartId = 'TotalRequest';
  const response = await fetch(`${apiUrl}/api/1.0/request?time=${time}`);
  const memories = await response.json();
  const times = memories.map((memory) => memory._time);
  const values = memories.map((memory) => memory._value);

  const ctx = document.getElementById('httpRequestChart').getContext('2d');

  if (charts[chartId]) {
    charts[chartId].destroy();
  }

  charts[chartId] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: times,
      datasets: [{
        label: 'Http Total Request',
        data: values,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 3,
        lineTension: 0,
        pointRadius: 0,
        pointHoverRadius: 7,
      }],
    },
    options,
  });
}

export async function getMaxResponseChart(time) {
  const chartId = 'MaxResponse';
  const response = await fetch(`${apiUrl}/api/1.0/response?time=${time}`);
  const rawData = await response.json();

  const groupData = rawData.reduce((accumulator, entry) => {
    if (!accumulator[entry.api]) {
      accumulator[entry.api] = [];
    }
    accumulator[entry.api].push(entry);
    return accumulator;
  }, {});

  const groupKeys = Object.keys(groupData);

  const data = groupKeys.map((api) => groupData[api].map((entry) => { return { api: entry.api, value: entry._value }; }));

  const parsedData = data.map((item) => item[0]);
  //  data.value 從大排到小, merging sort
  const sortedData = mergeSort(parsedData);
  const sortedValues = sortedData.map((item) => item.value);
  const sortedKeys = sortedData.map((item) => item.api);

  const ctx = document.getElementById('maxResponseChart');
  const backgroundColors = [];
  for (let i = 0; i < groupKeys.length; i++) {
    backgroundColors.push(getRandomColor());
  }

  if (charts[chartId]) {
    charts[chartId].destroy();
  }

  charts[chartId] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: sortedKeys,
      datasets: [{
        label: '# of APIs',
        data: sortedValues,
        backgroundColor: backgroundColors,
      }],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

export async function getRequestSecondChart(time) {
  const chartId = 'RequestSecond';
  const response = await fetch(`${apiUrl}/api/1.0/request-second?time=${time}`);
  const data = await response.json();
  const times = data.map((entry) => entry._time);
  const values = data.map((entry) => entry._value);

  const ctx = document.getElementById('requestSecondChart');

  if (charts[chartId]) {
    charts[chartId].destroy();
  }

  charts[chartId] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: times,
      datasets: [{
        label: 'Request Per Second',
        data: values,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 3,
        lineTension: 0,
        pointRadius: 0,
        pointHoverRadius: 7,
      }],
    },
    options,
  });
}

export async function getCPULoad1m(time) {
  const chartId = 'CpuLoad_1m';
  const response = await fetch(`${apiUrl}/api/1.0/cpu-load/1?time=${time}`);
  const loads = await response.json();
  const times = loads.map((load) => load._time);
  const values = loads.map((load) => load._value);

  const ctx = document.getElementById('cpuLoad-1m').getContext('2d');

  if (charts[chartId]) {
    charts[chartId].destroy();
  }

  charts[chartId] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: times,
      datasets: [{
        label: 'CPU Average Load 1m',
        data: values,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 3,
        lineTension: 0,
        pointRadius: 0,
        pointHoverRadius: 7,
      }],
    },
    options,
  });
}

export async function getCPULoad5m(time) {
  const chartId = 'CpuLoad_5m';
  const response = await fetch(`${apiUrl}/api/1.0/cpu-load/5?time=${time}`);
  const loads = await response.json();
  const times = loads.map((load) => load._time);
  const values = loads.map((load) => load._value);

  const ctx = document.getElementById('cpuLoad-5m').getContext('2d');

  if (charts[chartId]) {
    charts[chartId].destroy();
  }

  charts[chartId] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: times,
      datasets: [{
        label: 'CPU Average Load 5m',
        data: values,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 3,
        lineTension: 0,
        pointRadius: 0,
        pointHoverRadius: 7,
      }],
    },
    options,
  });
}

export async function getCPULoad15m(time) {
  const chartId = 'CpuLoad_15m';
  const response = await fetch(`${apiUrl}/api/1.0/cpu-load/15?time=${time}`);
  const loads = await response.json();
  const times = loads.map((load) => load._time);
  const values = loads.map((load) => load._value);

  const ctx = document.getElementById('cpuLoad-15m').getContext('2d');

  if (charts[chartId]) {
    charts[chartId].destroy();
  }

  charts[chartId] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: times,
      datasets: [{
        label: 'CPU Average Load 15m',
        data: values,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 3,
        lineTension: 0,
        pointRadius: 0,
        pointHoverRadius: 7,
      }],
    },
    options,
  });
}
