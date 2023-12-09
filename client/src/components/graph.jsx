// import '../script/dashboard.js';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { getChart } from '../script/chart.js';

function GraphTitle() {
  return (
    <div className='graphTitle'>
      <h1>Graph</h1>
    </div>
  );
}

function GraphList() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30m');
  const [selectedChartType, setSelectedChartType] = useState('line');
  const [allItems, setAllItems] = useState([]);
  const [visibleCharts, setVisibleCharts] = useState({});
  const [responseError, setError] = useState(null);

  const fetchItemsAPI = `${import.meta.env.VITE_HOST}/api/1.0/fetchItems`;

  useEffect(() => {
    axios.get(fetchItemsAPI)
      .then((response) => {
        const items = response.data;
        setAllItems(items);

        const visibilityState = items.reduce((acc, chart) => {
          acc[chart.item] = true;
          return acc;
        }, {});

        setVisibleCharts(visibilityState);
      })
      .catch((error) => {
        console.error(error);
        setError(error);
      });
  }, []);

  useEffect(() => {
    if (allItems.length > 0) {
      allItems.forEach((item) => {
        getChart(item.item, selectedTimeRange, selectedChartType);
      });
    }
  }, [allItems, selectedTimeRange]);

  const updateTimeRange = async (event) => {
    const newTimeRange = event.target.value;
    setSelectedTimeRange(newTimeRange);
    allItems.forEach((item) => {
      if (visibleCharts[item.item]) {
        getChart(item.item, newTimeRange, selectedChartType);
      }
    });
  };

  const updateChartType = async (event) => {
    const newChartType = event.target.value;
    setSelectedChartType(newChartType);
    allItems.forEach((item) => {
      if (visibleCharts[item.item]) {
        getChart(item.item, selectedTimeRange, newChartType);
      }
    });
  };

  const toggleChartVisibility = (chartName) => {
    setVisibleCharts((prevState) => {
      const chartShouldBeVisible = !prevState[chartName];
      const newState = { ...prevState, [chartName]: chartShouldBeVisible };

      if (chartShouldBeVisible) {
        getChart(chartName, selectedTimeRange, selectedChartType);
      }

      return newState;
    });
  };

  const clearAllCharts = () => {
    setVisibleCharts(allItems.reduce((acc, chart) => ({
      ...acc, [chart.item]: false,
    }), {}));
  };

  const selectAllCharts = () => {
    const newVisibleCharts = allItems.reduce((acc, chart) => ({
      ...acc, [chart.item]: true,
    }), {});

    setVisibleCharts(newVisibleCharts);

    allItems.forEach((chart) => {
      if (newVisibleCharts[chart.item]) {
        getChart(chart.item, selectedTimeRange, selectedChartType);
      }
    });
  };

  if (responseError) {
    return (
      <div className='error'>
        <h2>{responseError.message}</h2>
        <p>{responseError.stack}</p>
      </div>
    );
  }

  return (
    <div className='chartContainer'>
      <div className="times">
        <label className='timeLabel'>Time Range:</label>
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
        <label className='typeLabel'>Chart Type:</label>
        <select id="typeSelect" value={selectedChartType} onChange={updateChartType}>
          <option value="line">Line Chart</option>
          <option value="bar-group">Bar Chart, x-axis=group</option>
          <option value="bar-time">Bar Chart, x-axis=time</option>
        </select>
        <button className='clearBtn' onClick={clearAllCharts}>Clear All Charts</button>
        <button className='selectBtn' onClick={selectAllCharts}>Select All Charts</button>
      </div>

      <div className='chart-selection'>
        {allItems && allItems.map((chart) => (
          <div key={chart.item}>
            <input
              type='checkbox'
              id={`chk-${chart.item}`}
              checked={visibleCharts[chart.item]}
              onChange={() => toggleChartVisibility(chart.item)}
            />
            <label htmlFor={`chk-${chart.item}`}>{chart.item.replace(/_/g, ' ')}</label>
          </div>

        ))}
      </div>

      <div className="charts">
          <div className="chartWrap">
            {allItems && allItems.map((item) => (
              visibleCharts[item.item] && (
                <div className="chart" key={item.item}>
                  <h3>{item.item.replace(/_/g, ' ')}</h3>
                  <canvas id={item.item}></canvas>
                </div>
              )
            ))}
          </div>
      </div>
    </div>
  );
}

function GraphContainer() {
  return (
    <div>
      <GraphTitle />
      <GraphList />
    </div>
  );
}

export default GraphContainer;
