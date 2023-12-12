/* eslint-disable no-param-reassign */
/* eslint-disable no-inner-declarations */
import { alertFile } from '../utils/yml-util.js';
import { fetchAlertStatus } from '../models/alert.js';

async function groupMapping(groups) {
  const promises = groups.map(async (group) => {
    const alertStatus = await fetchAlertStatus(group);

    const isFiring = alertStatus.find((status) => status._field === 'isFiring');
    group.isFiring = (isFiring) ? isFiring._value : undefined;

    const startTime = alertStatus.find((status) => status._field === 'startTime');
    group.startTime = (startTime) ? startTime._value : undefined;

    return group;
  });

  return promises;
}
export async function showAlerts(req, res) {
  try {
    const { page, limit } = req.query;
    const pageInt = Number(page);
    const limitInt = Number(limit);
    const { groups } = alertFile;

    if (!alertFile || !groups || groups.length === 0 || !pageInt || pageInt === 0 || !limitInt || limitInt === 0) {
      return res.status(200).json({ message: 'There is no alerting rule currently' });
    }

    const slicedGroups = groups.slice(limit * (page - 1), limit * page + 1);
    const totalPage = Math.ceil(groups.length / limit);

    const alertPromises = await groupMapping(slicedGroups);

    await Promise.allSettled(alertPromises);
    return res.status(200).json({ groups: slicedGroups, total: totalPage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message, stack: error.stack });
  }
}

export async function searchAlerts(req, res) {
  const { page, term, limit } = req.query;
  const { groups } = alertFile;
  if (!alertFile || !groups || groups.length === 0) {
    return res.status(200).json({ message: 'There is no alerting rule currently' });
  }

  const searchedGroups = groups.filter((group) => group.name.toUpperCase().includes(term.toUpperCase()));
  const slicedGroups = searchedGroups.slice(limit * (page - 1), limit * page + 1);

  const totalPage = Math.ceil(searchedGroups.length / limit);

  const alertPromises = await groupMapping(slicedGroups);

  await Promise.allSettled(alertPromises);
  return res.status(200).json({ groups: slicedGroups, total: totalPage });

}

export default showAlerts;
