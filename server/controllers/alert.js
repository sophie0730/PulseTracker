/* eslint-disable no-param-reassign */
/* eslint-disable no-inner-declarations */
import { alertFile } from '../utils/yml-util.js';
import { fetchAlertStatus } from '../models/alert.js';

export async function showAlerts(req, res) {
  try {
    const { groups } = alertFile;

    const alertPromises = groups.map(async (group) => {
      const alertStatus = await fetchAlertStatus(group);

      const isFiring = alertStatus.find((status) => status._field === 'isFiring');
      group.isFiring = (isFiring) ? isFiring._value : undefined;

      const startTime = alertStatus.find((status) => status._field === 'startTime');
      group.startTime = (startTime) ? startTime._value : undefined;

      return group;
    });

    await Promise.allSettled(alertPromises);
    res.json(alertFile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message, stack: error.stack });
  }
}

export default showAlerts;
