import dotenv from 'dotenv';
import * as store from '../models/store.js';

dotenv.config();

const TIMEOUT = 10000;

function scheduleStoreSystemData() {
  store.storeSystemData()
    .then(() => {
      setTimeout(scheduleStoreSystemData, TIMEOUT);
    })
    .catch((error) => {
      console.error(error);
      setTimeout(scheduleStoreSystemData, TIMEOUT);
    });
}

function scheduleStoreAppData() {
  store.storeApplicationData()
    .then(() => {
      setTimeout(scheduleStoreAppData, TIMEOUT);
    })
    .catch((error) => {
      console.error(error);
      setTimeout(scheduleStoreAppData, TIMEOUT);
    });
}

scheduleStoreSystemData();
scheduleStoreAppData();
