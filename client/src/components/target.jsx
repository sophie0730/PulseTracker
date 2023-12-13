/* eslint-disable arrow-body-style */
import { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

function TargetTitle() {
  return (
    <div className="targetTitle">
      <h1>Targets</h1>
    </div>
  );
}

export function Target() {
  const targetAPI = `${import.meta.env.VITE_HOST}/api/1.0/targets`;
  const [targetStatus, setTargetStatus] = useState([]);
  const [responseError, setError] = useState(null);

  useEffect(() => {
    axios.get(targetAPI)
      .then((response) => {
        const targetArr = response.data;
        setTargetStatus(targetArr);
      })
      .catch((error) => {
        console.error(error);
        setError(error);
      });

    const socket = io();
    socket.on('connect', () => console.log('connected to socket.io server'));
    socket.on('dataUpdate', () => {
      axios.get(targetAPI)
        .then((response) => {
          const targetArr = response.data;
          setTargetStatus(targetArr);
        })
        .catch((error) => console.error(error));
    });
  }, []);

  if (responseError) {
    return (
      <div className='error'>
        <h2>{responseError.message}</h2>
        <p>{responseError.stack}</p>
      </div>
    );
  }

  return (
    <div className='servers'>
    {targetStatus && targetStatus.map((server) => {
      const state = (server._value === 1) ? 'UP' : 'DOWN';
      const errorMessage = (server._field === 'error') ? server._value : '';

      return (
        <div className='server' key={server.target}>
          <div className={`serverName ${state}`}>
            <h2>{server.name}</h2>
          </div>
          <table>
            <thead>
              <tr>
                <th className='endpoint'>Endpoint</th>
                <th className='state'>State</th>
                <th className='scrape'>Last Scrape</th>
                <th className='error'>Error</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className='endpoint'><a href={`${server.target}`} className="custom-link">{server.target}</a></span></td>
                <td><span className={`state${state}`}>{state}</span></td>
                <td><span className='scrape'>{server.lastScrape}</span></td>
                <td><span className='error'>{errorMessage}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    })}
    </div>
  );
}

export function TargetPanel() {
  return (
    <main>
      <TargetTitle />
      <Target />
    </main>
  );
}
export default TargetPanel;
