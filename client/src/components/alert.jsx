import { useEffect, useState } from 'react';
import axios from 'axios';

function AlertTitle() {
  return (
    <div className="title">
      <h1>Alerts</h1>
    </div>
  );
}

function Target() {
  const alertAPI = '/api/1.0/alert';
  const [alertStatus, setAlertStatus] = useState({});

  useEffect(() => {
    axios.get(alertAPI)
      .then((response) => {
        const alertObj = response.data;
        setAlertStatus(alertObj);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    console.log(alertStatus.groups);
  }, [alertStatus]);

  // eslint-disable-next-line block-spacing, no-lone-blocks, no-unused-expressions
  return (
    <div className='alerts'>
      {alertStatus.groups && alertStatus.groups.map((group) => {
        console.log(group);
        let firingClass = '';
        let backGroundClass = '';
        if (group.startTime === 'NA') {
          firingClass = 'NORMAL';
          backGroundClass = 'GREEN';
        } else {
          firingClass = (group.isFiring === 'true') ? 'FIRING' : 'PENDING';
          backGroundClass = (group.isFiring === 'true') ? 'RED' : 'YELLOW';
        }
        return (
            <div className='alert' key={group.name}>
              <div className={`groupName ${backGroundClass}`}>
                <h2>{group.name}</h2>
              </div>
              <div className='rule'>
                <pre id='alertText'>
                  alert: {group.rules[0].alert} <br />
                  expr: {group.rules[0].expr} <br />
                  for: {group.rules[0].for} <br />
                  labels: <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;severity: {group.rules[0].labels.severity} <br />
                  annotations: <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;summary: {group.rules[0].annotations.summary} <br />
                </pre>
              </div>
              <table>
                <thead>
                  <tr>
                    <th className='state'>State</th>
                    <th className='startTime'>Active Since</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span className={`state ${firingClass}`}>{firingClass}</span></td>
                    <td><span className='startTime'>{group.startTime}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
        );
      })}
    </div>
  );
}

export function AlertPanel() {
  return (
    <main>
      <AlertTitle />
      <Target />
    </main>
  );
}

export default AlertPanel;
