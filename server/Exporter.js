import { spawn } from 'child_process';

const systemExporterFile = './exporters/system.js';
const applicationExporterFile = './exporters/application.js';

function startExporter(fileName) {
  const worker = spawn('node', [fileName]);
  worker.stdout.on('data', (data) => console.log(data.toString()));
  worker.stderr.on('data', (data) => console.error(`Exporter error: ${data.toString()}`));
  worker.on('close', (code) => console.log(`Exporter is closed by code ${code}`));
}

startExporter(applicationExporterFile);
startExporter(systemExporterFile);
