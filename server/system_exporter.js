import { exec } from 'child_process';

exec('node exporters/system.js', (error, stdout, stderr) => {
  if (error) {
    console.error(error);
  }

  if (stderr) {
    console.error(stderr);
  }

  console.log(stdout);
});
