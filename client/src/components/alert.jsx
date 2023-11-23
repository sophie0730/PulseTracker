import { useEffect, useState } from 'react';
import axios from 'axios';

export function Target() {
  const alertAPI = 'http://localhost:4000/api/1.0/alert';
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

  return (
    <main>
      <div className="title">
        <h1>Alerts</h1>
      </div>
      <div className="alerts">
        {alertStatus.groups && alertStatus.groups.map((group) => (
          <div className='alert' key={group.name}>
            <h1>{group.name}</h1>
            <p>
              alert: {group.rules[0].alert}
              expr: {group.rules[0].expr}
              for: {group.rules[0].for}
              labels:
                severity: {group.rules[0].labels.severity}
              annotations:
                summary: {group.rules[0].annotations.summary}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Target;
