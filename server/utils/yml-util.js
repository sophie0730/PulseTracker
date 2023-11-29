import * as yaml from 'js-yaml';
import * as fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'pulse.yml');
export const configFile = yaml.load(fs.readFileSync(filePath), 'utf-8');

const alertFilePath = path.join(process.cwd(), configFile.rule_files[0]);
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

// redis
export const redisPort = configFile.redis.port;
