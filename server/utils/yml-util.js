import * as yaml from 'js-yaml';
import * as fs from 'fs';
import { findUp } from 'find-up';
import path from 'path';

const filePath = await findUp('pulse.yml');

export const configFile = yaml.load(fs.readFileSync(filePath), 'utf-8');

const alertFilePath = path.join(path.dirname(filePath), configFile.rule_files[0]);
export const alertFile = yaml.load(fs.readFileSync(alertFilePath), 'utf-8');
// 現在先設只能有一個config檔!!

// server
const port = configFile.scrape_configs[0].static_configs.targets;
const protocol = configFile.scrape_configs[0].scheme;
export const serverPort = `${protocol}://${port}`;

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
