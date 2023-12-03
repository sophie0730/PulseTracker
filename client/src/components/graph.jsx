// import '../script/dashboard.js';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { updateDashboard } from '../script/dashboard.js';

export function Graph() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('');
  const updateTimeRange = async (event) => {
    setSelectedTimeRange(event.target.value);
    console.log(event.target.value);
    await updateDashboard(event.target.value);
  };

  const fetchItemsAPI = 'http://localhost:4000/api/1.0/fetchItems';
  const [allItems, setAllItems] = useState('');

  useEffect(() => {
    axios.get(fetchItemsAPI)
      .then((response) => {
        const items = response.data;
        setAllItems(items);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <main>
      <div className="times">
        <select id="timeRangeSelect" value={selectedTimeRange} onChange={updateTimeRange}>
          <option value="30m">30 minutes</option>
          <option value="1h">1 hour</option>
          <option value="2h">2 hour</option>
          <option value="3h">3 hour</option>
          <option value="6h">6 hour</option>
          <option value="8h">8 hour</option>
          <option value="12h">12 hour</option>
          <option value="24h">24 hour</option>
        </select>

      </div>
      <div className="charts">
        <div className="chartWrap">
          {allItems && allItems
            .filter((item) => item.item !== 'up')
            .map((item) => (
              <div className="chart" key={item.item}>
                <h3>{item.item}</h3>
                <canvas id={item.item}></canvas>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}

export default Graph;
