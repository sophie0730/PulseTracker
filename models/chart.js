/* eslint-disable arrow-body-style */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
/* eslint-disable no-new */
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export async function getCPUChart(time) {
  const response = await fetch(`/api/1.0/cpu?time=${time}`);
  const cpus = await response.json();
  const times = cpus.map((cpu) => cpu._time);
  const values = cpus.map((cpu) => cpu._value);

  const ctx = document.getElementById('cpuUsageChart').getContext('2d');

  new Chart(ctx, {
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
        pointRadius: 3,
        pointHoverRadius: 7,
      }],
    },
    options: {
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
    },
  });
}

export async function getMemoryChart(time) {
  const response = await fetch(`/api/1.0/memory?time=${time}`);
  const memories = await response.json();
  const times = memories.map((memory) => memory._time);
  const values = memories.map((memory) => memory._value);

  const ctx = document.getElementById('memoryUsageChart').getContext('2d');

  new Chart(ctx, {
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
        pointRadius: 3,
        pointHoverRadius: 7,
      }],
    },
    options: {
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
    },
  });
}

export async function getDiskReadChart(time) {
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
      backgroundColor: getRandomColor(),
      borderWidth: 3,
      pointRadius: 3,
      pointHoverRadius: 7,
    };
  });
  const ctx = document.getElementById('diskReadChart').getContext('2d');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: rawData.map((entry) => entry._time),
      datasets,
    },
    options: {
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
    },
  });
}

export async function getDiskWriteChart(time) {
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
      backgroundColor: getRandomColor(),
      borderWidth: 3,
      pointRadius: 3,
      pointHoverRadius: 7,
    };
  });
  const ctx = document.getElementById('diskWriteChart').getContext('2d');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: rawData.map((entry) => entry._time),
      datasets,
    },
    options: {
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
    },
  });
}

export async function getTotalRequestChart(time) {
  const response = await fetch(`/api/1.0/request?time=${time}`);
  const memories = await response.json();
  const times = memories.map((memory) => memory._time);
  const values = memories.map((memory) => memory._value);

  const ctx = document.getElementById('httpRequestChart').getContext('2d');

  new Chart(ctx, {
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
        pointRadius: 3,
        pointHoverRadius: 7,
      }],
    },
    options: {
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
    },
  });
}

export async function getMaxResponseChart(time) {
  const response = await fetch(`/api/1.0/response?time=${time}`);
  const rawData = await response.json();

  const groupData = rawData.reduce((accumulator, entry) => {
    if (!accumulator[entry.api]) {
      accumulator[entry.api] = [];
    }
    accumulator[entry.api].push(entry);
    return accumulator;
  }, {});

  const groupKeys = Object.keys(groupData);
  const datasets = groupKeys.map((api) => {
    return {
      label: `API: ${api}`,
      data: groupData[api].map((entry) => entry._value),
      fill: false,
      backgroundColor: getRandomColor(),
      borderWidth: 3,
      pointRadius: 3,
      pointHoverRadius: 7,
    };
  });

  const ctx = document.getElementById('maxResponseChart');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: rawData.map((entry) => entry._time),
      datasets,
    },
    options: {
      scales: {
        x: {
          type: 'time',
          time: {
            // unit: 'minute',
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
    },
  });
}

export async function getCPULoad1m(time) {
  const response = await fetch(`/api/1.0/cpu-load/1?time=${time}`);
  const loads = await response.json();
  const times = loads.map((load) => load._time);
  const values = loads.map((load) => load._value);

  const ctx = document.getElementById('cpuLoad-1m').getContext('2d');
  new Chart(ctx, {
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
        pointRadius: 3,
        pointHoverRadius: 7,
      }],
    },
    options: {
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
    },
  });
}

export async function getCPULoad5m(time) {
  const response = await fetch(`api/1.0/cpu-load/5?time=${time}`);
  const loads = await response.json();
  const times = loads.map((load) => load._time);
  const values = loads.map((load) => load._value);

  const ctx = document.getElementById('cpuLoad-5m').getContext('2d');
  new Chart(ctx, {
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
        pointRadius: 3,
        pointHoverRadius: 7,
      }],
    },
    options: {
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
    },
  });
}

export async function getCPULoad15m(time) {
  const response = await fetch(`api/1.0/cpu-load/15?time=${time}`);
  const loads = await response.json();
  const times = loads.map((load) => load._time);
  const values = loads.map((load) => load._value);

  const ctx = document.getElementById('cpuLoad-15m').getContext('2d');
  new Chart(ctx, {
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
        pointRadius: 3,
        pointHoverRadius: 7,
      }],
    },
    options: {
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
    },
  });
}
