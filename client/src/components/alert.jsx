import { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import PropTypes from 'prop-types';

// eslint-disable-next-line react/prop-types
function AlertTitle({ onSearchChange }) {
  const [inputValue, setInputValue] = useState('');

  const handleSearchIconClick = () => {
    onSearchChange(inputValue);
  };
  return (
    <div className='head'>
      <div className="title">
        <h1>Alerts</h1>
      </div>
      <div className="search">
        <input className="searchBar" placeholder="Search Alerts..." onChange={(e) => {
          setInputValue(e.target.value);
        }}></input>
        <a href="#" onClick={handleSearchIconClick}>
          <img src="./images/search.png" alt="Search"></img>
        </a>
      </div>
    </div>
  );
}

// eslint-disable-next-line react/prop-types
function AlertList({
  // eslint-disable-next-line react/prop-types
  alertStatusGroups, collapsedGroups, toggleCollapse,
}) {
  return (
    <div className='alerts'>
      {alertStatusGroups && alertStatusGroups.map((group) => {
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

AlertList.propTypes = {
  alertStatusGroups: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    startTime: PropTypes.string,
  })).isRequired,
  collapsedGroups: PropTypes.object.isRequired,
  toggleCollapse: PropTypes.func.isRequired,
};

function Pagination({
  currentPage, totalPages, handlePageChange, handlePageSizeChange, pageSize,
}) {
  return (
      <ul className='pagination pagination-md justify-content-end'>
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <span className='page-link' onClick={() => handlePageChange(1)}>&laquo;&laquo;</span>
        </li>
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <span className='page-link' onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}>&laquo;</span>
        </li>
        {currentPage}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <span className='page-link' onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}>&raquo;</span>
        </li>
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <span className='page-link' onClick={() => handlePageChange(totalPages)}>&raquo;&raquo;</span>
        </li>
        <select value={pageSize} onChange={(e) => handlePageSizeChange(e.target.value)}>
        {[5, 10, 15, 20].map((size) => (
          <option key={size} value={size}>{size}</option>
        ))}
        </select>
      </ul>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  handlePageSizeChange: PropTypes.func.isRequired,
  pageSize: PropTypes.string.isRequired,
};

function AlertContainer() {
  const [alertStatus, setAlertStatus] = useState({ groups: [] });
  const [pageStatus, setPageStatus] = useState({ groups: [] });
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [responseError, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const alertAPI = `${import.meta.env.VITE_HOST}/api/1.0/alert?page=${currentPage}&limit=${pageSize}`;
  const SERVER_URL = 'http://localhost:4000';

  useEffect(() => {
    const fetchData = () => {
      axios.get(alertAPI)
        .then((response) => {
          const alertObj = response.data;
          setPageStatus(alertObj);
          if (!alertObj.message) {
            setAlertStatus({ groups: alertObj.groups.slice(0, alertObj.groups.length) });
            setTotalPages(alertObj.total);
          }

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
    };

    fetchData();

    const socket = io(SERVER_URL);
    socket.on('connect', () => console.log('connected to socket.io server'));
    socket.on('dataUpdate', fetchData);

    return () => {
      socket.off('dataUpdate', fetchData);
      socket.disconnect();
    };
  }, [currentPage, pageSize]);

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

  if (pageStatus.message) {
    return (
      <div className='error'>
        <div className="title">
          <h1>Alerts</h1>
        </div>
        <h2>{pageStatus.message}</h2>
      </div>
    );
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
  };

  const handleSearchTerm = (newTerm) => {
    setSearchTerm(newTerm);
    setCurrentPage(1);

    const searchAPI = `${import.meta.env.VITE_HOST}/api/1.0/alert/search?page=${currentPage}&term=${newTerm}&limit=${pageSize}`;
    axios.get(searchAPI)
      .then((response) => {
        const alertObj = response.data;
        setPageStatus(alertObj);
        console.log(alertObj);
        if (!alertObj.message) {
          setAlertStatus({ groups: alertObj.groups.slice(0, alertObj.groups.length) });
          setTotalPages(alertObj.total);
        }

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
  };

  return (
    <div>
      <AlertTitle onSearchChange={handleSearchTerm} />
      <AlertList
        alertStatusGroups={alertStatus.groups}
        collapsedGroups={collapsedGroups}
        toggleCollapse={toggleCollapse}
        searchTerm={searchTerm}
      ></AlertList>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        handlePageSizeChange={handlePageSizeChange}
        pageSize={pageSize}
      />

    </div>
  );
}

export default AlertContainer;
