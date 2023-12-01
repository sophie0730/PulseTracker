/* eslint-disable no-unused-vars */
import { spawn } from 'child_process';
import * as net from 'net';
import { influxPort, influxPath, redisPort } from './utils/yml-util.js';
import * as storeWorker from './workers/store.js';
import * as alertWorker from './workers/alert.js';
import * as server from './app.js';
