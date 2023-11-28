/* eslint-disable no-inner-declarations */
import { alertFile } from '../utils/yml-util.js';
import { fetchAlertStatus } from '../models/alert.js';

export async function showAlerts(req, res) {
  try {
    const { groups } = alertFile;
    const arr = [];

    async function addAlertStatus() {
      // eslint-disable-next-line no-restricted-syntax
      for (const group of groups) {
        // eslint-disable-next-line no-await-in-loop
        const alertStatus = await fetchAlertStatus(group);

        const [isFiring] = alertStatus.filter((status) => status._field === 'isFiring');
        group.isFiring = (isFiring) ? isFiring._value : undefined;

        const [startTime] = alertStatus.filter((status) => status._field === 'startTime');
        group.startTime = (startTime) ? startTime._value : undefined;

        arr.push(group);
      }
    }

    await addAlertStatus();
    res.json(alertFile);
  } catch (error) {
    console.error(error);
  }
}

export default showAlerts;
