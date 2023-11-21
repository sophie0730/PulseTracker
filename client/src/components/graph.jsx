// import '../script/dashboard.js';

import { useState } from 'react';
import { updateDashboard } from '../script/dashboard.js';

// ]value={selectedTimeRange} onChange={updateTimeRange}

export function Graph() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('');

  const updateTimeRange = async (event) => {
    setSelectedTimeRange(event.target.value);
    console.log(event.target.value);
    await updateDashboard(event.target.value);
  };

  return (
    <main>
      <div className="times">
        <select id="timeRangeSelect" value={selectedTimeRange} onChange={updateTimeRange}>
          <option value="30m">30 minutes</option>
          <option value="1h">1 hour</option>
          <option value="2h">2 hour</option>
          <option value="3h">3 hour</option>
        </select>
        {/* <button id="timeBtn" onClick={window.updateTimeRange}>
          Send
        </button> */}
      </div>
      <div className="charts">
        <div className="chartWrap">
          <div className="chart">
            <h3>CPU Average Usage</h3>
            <canvas id="cpuUsageChart"></canvas>
          </div>
          <div className="chart">
            <h3>Memory Usage</h3>
            <canvas id="memoryUsageChart"></canvas>
          </div>
          <div className="chart">
            <h3>Disk Average Read Time (ms)</h3>
            <canvas id="diskReadChart"></canvas>
          </div>
          <div className="chart">
            <h3>Disk Average Write Time (ms)</h3>
            <canvas id="diskWriteChart"></canvas>
          </div>
          <div className="chart">
            <h3>CPU Average Load Time 1m</h3>
            <canvas id="cpuLoad-1m"></canvas>
          </div>
          <div className="chart">
            <h3>CPU Average Load Time 5m</h3>
            <canvas id="cpuLoad-5m"></canvas>
          </div>
          <div className="chart">
            <h3>CPU Average Load Time 15m</h3>
            <canvas id="cpuLoad-15m"></canvas>
          </div>
          <div className="chart">
            <h3>Http Total Request</h3>
            <canvas id="httpRequestChart"></canvas>
          </div>
          <div className="chart">
            <h3>Request Per Second</h3>
            <canvas id="requestSecondChart"></canvas>
          </div>
        </div>
        <div className="chartBar">
          <h3>Max response time per API (ms)</h3>
          <canvas id="maxResponseChart"></canvas>
        </div>
      </div>
    </main>
  );
}

export default Graph;
