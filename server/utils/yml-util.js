import * as yaml from 'js-yaml';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = path.join(__dirname, '..', 'yml', 'pulse.yml');
export const configFile = yaml.load(fs.readFileSync(filePath), 'utf-8');

const alertFilePath = path.join(__dirname, '..', 'yml', configFile.rule_files[0]);
export const alertFile = yaml.load(fs.readFileSync(alertFilePath), 'utf-8');
// 現在先設只能有一個config檔!!

//  email
export const emailReceivers = configFile.alerting.static_configs.receivers;

// server url
export const serverUrlArr = configFile.scrape_configs;

// timeout setting
export const storeTimeout = configFile.global.store_timeout;
export const alertTimeout = configFile.global.alert_timeout;

// influxdb
export const influxPath = configFile.influx_db.execute_path;
export const influxPort = configFile.influx_db.port;
