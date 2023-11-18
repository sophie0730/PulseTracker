import { storeSystemData, storeApplicationData } from '../models/store.js';

const TIMEOUT = 10000;

function scheduleStoreSystemData() {
  storeSystemData()
    .then(() => {
      setTimeout(scheduleStoreSystemData, TIMEOUT);
    })
    .catch((error) => {
      console.error(error);
      setTimeout(scheduleStoreSystemData, TIMEOUT);
    });
}

function scheduleStoreAppData() {
  storeApplicationData()
    .then(() => {
      setTimeout(scheduleStoreAppData, TIMEOUT);
    })
    .catch((error) => {
      console.error(error);
      setTimeout(storeApplicationData, TIMEOUT);
    });
}

scheduleStoreSystemData();
scheduleStoreAppData();
