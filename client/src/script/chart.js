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
    },
    y: {
      beginAtZero: true,
    },
  },
};

const charts = {};

export async function getChart(item, time, type) {
  // if (item === 'max_response_time') {
  //   await getMaxResponseChart(item, time);
  // }
  const chartId = item;
  const response = await axios.get(`http://localhost:4000/api/1.0/fetch/${item}?time=${time}`);
  const responseData = await response.data;
  const times = responseData.map((element) => element._time);
  const values = responseData.map((element) => element._value);

  const ctx = document.getElementById(`${item}`).getContext('2d');
  console.log(ctx);

  let datasets = [{
    label: `${item}`,
    data: values,
    backgroundColor: 'rgba(255, 99, 132, 0.2)',
    borderColor: 'rgba(255, 99, 132, 1)',
    borderWidth: 3,
    lineTension: 0,
    pointRadius: 0,
    pointHoverRadius: 7,
  }];

  let data = {
    labels: times,
    datasets,
  };

  const tags = responseData.map((element) => element.tag);
  if (tags && tags[0] !== undefined) {
    const tag = tags[0];
    console.log(tag);
    const groupData = responseData.reduce((accumulator, entry) => {
      if (!accumulator[entry[tag]]) {
        accumulator[entry[tag]] = [];
      }
      accumulator[entry[tag]].push(entry);
      return accumulator;
    }, {});

    const groupKeys = Object.keys(groupData);

    if (type === 'line') {
      datasets = groupKeys.map((key) => {
        return {
          label: `${tag} ${key}`,
          data: groupData[key].map((entry) => entry._value),
          fill: false,
          borderColor: getRandomColor(),
          borderWidth: 3,
          pointRadius: 0,
          pointHoverRadius: 7,
        };
      });
      data = {
        labels: responseData.map((entry) => entry._time),
        datasets,
      };
    } else {
      datasets = groupKeys.map((key) => {
        return {
          label: `${tag}`,
          data: groupData[key].map((entry) => entry._value),
          backgroundColor: getRandomColor(),
        };
      });
      data = {
        labels: groupKeys,
        datasets,
      };
    }

  }

  if (charts[chartId]) {
    charts[chartId].destroy();
  }

  charts[chartId] = new Chart(ctx, {
    type: (type === 'line') ? 'line' : 'bar',
    data,
    // eslint-disable-next-line no-nested-ternary
    options: (type === 'line') ? options : (type === 'bar-time') ? optionsBarWithTime : optionsBar,
  });
}

export async function getDiskReadChart(time) {
  const chartId = 'DiskRead';
  const response = await fetch(`/api/1.0/disk/read?time=${time}`);
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
    type,
    data: {
      labels: rawData.map((entry) => entry._time),
      datasets,
    },
    options,
  });
}

export async function getDiskWriteChart(time) {
  const chartId = 'DiskWrite';
  const response = await fetch(`/api/1.0/disk/write?time=${time}`);
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
  const response = await fetch(`/api/1.0/request?time=${time}`);
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

export async function getRequestSecondChart(time) {
  const chartId = 'RequestSecond';
  const response = await fetch(`/api/1.0/request-second?time=${time}`);
  const data = await response.json();
  const times = data.map((entry) => entry._time);
  const values = data.map((entry) => entry._value);

  const ctx = document.getElementById('requestSecondChart');

  if (charts[chartId]) {
    charts[chartId].destroy();
  }

  // charts[chartId] = new Chart(ctx, {
  //   type: 'line',
  //   data: {
  //     labels: times,
  //     datasets: [{
  //       label: 'Request Per Second',
  //       data: values,
  //       backgroundColor: 'rgba(255, 99, 132, 0.2)',
  //       borderColor: 'rgba(255, 99, 132, 1)',
  //       borderWidth: 3,
  //       lineTension: 0,
  //       pointRadius: 0,
  //       pointHoverRadius: 7,
  //     }],
  //   },
  //   options,
  // });
  charts[chartId] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: times,
      datasets: [{
        // labels: times,]
        label: 'Request Per Second',
        data: values,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        barThickness: 20,
      }],
    },
    options: {
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
    },
  });
}

export async function getCPULoad1m(time) {
  const chartId = 'CpuLoad_1m';
  const response = await fetch(`/api/1.0/cpu-load/1?time=${time}`);
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
  const response = await fetch(`/api/1.0/cpu-load/5?time=${time}`);
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
  const response = await fetch(`/api/1.0/cpu-load/15?time=${time}`);
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
