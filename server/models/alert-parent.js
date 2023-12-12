// /* eslint-disable no-restricted-syntax */
// /* eslint-disable arrow-parens */
// /* eslint-disable no-loop-func */
// /* eslint-disable no-undef */
// /* eslint-disable no-unused-vars */
// /* eslint-disable no-await-in-loop */
// /* eslint-disable no-param-reassign */
// /* eslint-disable import/no-extraneous-dependencies */
// import { fetchData } from './fetch.js';
// import * as influxUtils from '../utils/influxdb-util.js';
// import { sendEmail } from '../utils/email-util.js';
// import { sendLineMessage } from '../utils/line-util.js';
// import { publishUpdateMessage } from '../utils/redis-util.js';

// const MAX_CONCURRENT_TASKS = 5;

// function processAlertGroup(group, alertStates, timeRange) {
//   const scriptPath = './models/alert-child.js';
//   return new Promise((resolve, reject) => {
//     const worker = Bun.spawn(['bun', scriptPath], {
//       onExit(proc, exitCode, signalCode, error) {
//         if (exitCode !== 0 || error) {
//           console.log(`child process exit, code: ${exitCode}, signal: ${signalCode}`);
//           reject(new Error(`Child process failed with exit code ${exitCode}`));
//         } else {
//           console.log(`Child process exited successfully. Code: ${exitCode}`);
//         }
//       },
//       ipc(message) {
//         worker.send({ group, alertStates, timeRange });
//         console.log('Message from child process:', message);
//         if (message.done) {
//           resolve();
//         }
//       },
//       stdio: ['inherit', 'inherit', 'inherit'],
//     });

//   });
// }

// export async function checkAlerts(alertStates, timeRange, alertFile) {
//   try {
//     if (!alertFile) return;
//     const { groups } = alertFile;

//     if (groups.length === 0) return;

//     let runningTasks = [];
//     let index = 0;

//     while (index < groups.length || runningTasks.length > 0) {
//       while (index < groups.length && runningTasks.length < MAX_CONCURRENT_TASKS) {
//         const group = groups[index++];
//         const taskPromise = processAlertGroup(group, alertStates, timeRange)
//           .then(() => ({ status: 'resolved', task: taskPromise }))
//           .catch(error => ({ status: 'rejected', task: taskPromise, error }));

//         runningTasks.push(taskPromise);
//       }
//       console.log(runningTasks);

//       if (runningTasks.length > 0) {
//         const result = await Promise.race(runningTasks.map(p => p.catch(e => e)));
//         runningTasks = runningTasks.filter(task => task !== result.task);

//         if (result.status === 'rejected') {
//           console.error('A task failed:', result.error);
//         }
//       }
//     }
//     console.log('All tasks have completed');
//   } catch (error) {
//     console.error({ path: error.path, message: error.message });
//   }
// }
// export async function fetchAlertStatus(group) {
//   const fetchAlertQuery = `from(bucket: "${influxUtils.BUCKET}")
//     |> range(start: -1d)
//     |> filter(fn: (r) => r._measurement == "${influxUtils.ALERT_MEASUREMENT}")
//     |> filter(fn: (r) => r.item == "${group.name}")
//     |> last()
//     `;
//   const alertStatus = await fetchData(fetchAlertQuery);
//   return alertStatus;
// }
