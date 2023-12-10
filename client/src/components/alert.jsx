import { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

// eslint-disable-next-line react/prop-types
function AlertTitle({ onSearchChange }) {
  return (
    <div className='head'>
      <div className="title">
        <h1>Alerts</h1>
      </div>
      <div className="search">
        <input className="searchBar" placeholder="Search Alerts..." onChange={(e) => onSearchChange(e.target.value)}></input>
        <a href="#">
          <img src="./images/search.png" alt="Search"></img>
        </a>
      </div>
    </div>
  );
}

// eslint-disable-next-line react/prop-types
function AlertList({
  // eslint-disable-next-line react/prop-types
  alertStatus, collapsedGroups, toggleCollapse, searchTerm,
}) {
  const filteredGroups = searchTerm
    // eslint-disable-next-line react/prop-types
    ? alertStatus.groups.filter((group) =>
      // eslint-disable-next-line react/prop-types, implicit-arrow-linebreak
      group.name.toLowerCase().includes(searchTerm.toLowerCase()))
    // eslint-disable-next-line react/prop-types
    : alertStatus.groups;
  // eslint-disable-next-line block-spacing, no-lone-blocks, no-unused-expressions
  return (
    <div className='alerts'>
      {filteredGroups && filteredGroups.map((group) => {
        let firingClass = '';
        let backGroundClass = '';
        if (group.startTime === 'NA') {
          firingClass = 'NORMAL';
          backGroundClass = 'GREEN';
        } else if (!group.startTime) {
          firingClass = 'NOT_DETECTED';
          backGroundClass = 'GREY';
        } else {
          firingClass = (group.isFiring === 'true') ? 'FIRING' : 'PENDING';
          backGroundClass = (group.isFiring === 'true') ? 'RED' : 'YELLOW';
        }
        const startTimeLocale = (group.startTime !== 'NA') ? new Date(group.startTime).toLocaleString() : 'NA';
        const arrowDirection = collapsedGroups[group.name] ? '' : 'up';
        return (
            <div className='alert' key={group.name} onClick={(event) => toggleCollapse(group.name, event)}>
              <div className={`groupName ${backGroundClass}`}>
                <span className={`arrow ${arrowDirection}`}>
                  <img src='./images/arrow.png'></img>
                </span>
                <h2>{group.name}</h2>
              </div>
              {!collapsedGroups[group.name] && (
              <>
                <div className='rule'>
                  <pre id='alertText'>
                    alert: {group.rules[0].alert} <br />
                    expr: {group.rules[0].expr} <br />
                    for: {group.rules[0].for} <br />
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
                      <td><span className='startTime'>{startTimeLocale}</span></td>
                    </tr>
                  </tbody>
                </table>
              </>
              )}
          </div>
        );
      })}
    </div>
  );
}

function AlertContainer() {
  const alertAPI = `${import.meta.env.VITE_HOST}/api/1.0/alert`;
  const SERVER_URL = 'http://localhost:4000';
  const [alertStatus, setAlertStatus] = useState({ groups: [] });
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [responseError, setError] = useState(null);

  useEffect(() => {
    axios.get(alertAPI)
      .then((response) => {
        const alertObj = response.data;
        setAlertStatus(alertObj);

        const initialCollapseState = {};
        if (alertObj.groups) {
          alertObj.groups.forEach((group) => {
            initialCollapseState[group.name] = true;
          });
          setCollapsedGroups(initialCollapseState);
        }
      })
      .catch((error) => {
        console.error(error);
        setError(error);
      });

    const socket = io(SERVER_URL);
    socket.on('connect', () => console.log('connected to socket.io server'));
    socket.on('dataUpdate', () => {
      axios.get(alertAPI)
        .then((response) => {
          const alertObj = response.data;
          setAlertStatus(alertObj);
        })
        .catch((error) => {
          setError(error);
          console.error(error);
        });
    });
  }, []);

  const toggleCollapse = (groupName, event) => {
    event.stopPropagation(); // Stop event from triggering on child elements.
    setCollapsedGroups((prevState) => ({
      ...prevState,
      [groupName]: !prevState[groupName],
    }));
  };

  if (responseError) {
    return (
      <div className='error'>
        <div className="title">
          <h1>Alerts</h1>
        </div>
        <h2>{responseError.message}</h2>
        <p>{responseError.stack}</p>
      </div>
    );
  }

  if (alertStatus.message) {
    return (
      <div className='error'>
        <div className="title">
          <h1>Alerts</h1>
        </div>
        <h2>{alertStatus.message}</h2>
      </div>
    );
  }

  return (
    <div>
      <AlertTitle onSearchChange={setSearchTerm} />
      <AlertList
        alertStatus={alertStatus}
        collapsedGroups={collapsedGroups}
        toggleCollapse={toggleCollapse}
        searchTerm={searchTerm}
      ></AlertList>
    </div>
  );
}

export default AlertContainer;
