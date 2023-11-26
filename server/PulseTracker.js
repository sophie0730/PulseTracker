import { exec, spawn } from 'child_process';

//  start influxdb
const influxdPath = '/usr/local/bin/influxd';
const influxd = spawn(influxdPath, [], {
  detached: true,
  stdio: 'ignore',
});

influxd.unref();
console.log(`InfluxDB process started with PID: ${influxd.pid}`);

exec('app.js', (error, stdout, stderr) => {
  if (error) {
    console.error(error);
  }

  if (stderr) {
    console.error(stderr);
  }

  console.log(stdout);
});
