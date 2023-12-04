import * as heartbeatManager from '../models/heartbeat.js';

export function receiveHeartbeat(req, res) {
  const { workerId } = req.query;
  heartbeatManager.recordHeartbeat(workerId);
  res.send('Heartbeat received');
}

export default receiveHeartbeat;
