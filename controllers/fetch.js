import { BUCKET } from '../utils/influxdb-util.js';
import { fetchData } from '../models/fetch.js';

// const GROUP_BY_CLAUSE = `
// |> aggregateWindow(every: 10s, fn: mean)
// `;
const GROUP_BY_CLAUSE = '';

export async function fetchCPU(req, res) {
  try {
    const { time } = req.query;
    let fluxQuery = `from(bucket: "${BUCKET}")
    |> range(start: -${time})
    |> filter(fn: (r) => r.item == "cpu_average_usage")`;

    if (!time.includes('s')) {
      fluxQuery += GROUP_BY_CLAUSE;
    }

    const data = await fetchData(fluxQuery);
    res.json(data);
  } catch (error) {
    console.log(error);
  }
}

export async function fetchMemory(req, res) {
  try {
    const { time } = req.query;
    let fluxQuery = `from(bucket: "${BUCKET}")
    |> range(start: -${time})
    |> filter(fn: (r) => r.item == "memory_usage")`;

    if (!time.includes('s')) {
      fluxQuery += GROUP_BY_CLAUSE;
    }

    const data = await fetchData(fluxQuery);
    res.json(data);
  } catch (error) {
    console.log(error);
  }

}

export async function fetchDisk(req, res) {
  try {
    const { type } = req.params;
    const { time } = req.query;
    // const { device } = req.query;
    let fluxQuery = `from(bucket: "${BUCKET}")
    |> range(start: -${time})
    |> filter(fn: (r) => r.item == "disk_${type}_average_time")`;

    if (!time.includes('s')) {
      fluxQuery += GROUP_BY_CLAUSE;
    }

    const data = await fetchData(fluxQuery);
    res.json(data);
  } catch (error) {
    console.error(error);
  }
}

export async function fetchHttpRequest(req, res) {
  try {
    const { time } = req.query;
    let fluxQuery = `from(bucket: "${BUCKET}")
    |> range(start: -${time})
    |> filter(fn: (r) => r.item == "http_total_requests")`;

    if (!time.includes('s')) {
      fluxQuery += GROUP_BY_CLAUSE;
    }

    const data = await fetchData(fluxQuery);
    res.json(data);
  } catch (error) {
    console.error(error);
  }
}

export async function fetchResponse(req, res) {
  try {
    const { time } = req.query;
    const fluxQuery = `from(bucket: "${BUCKET}")
    |> range(start: -${time})
    |> filter(fn: (r) => r.item == "max_response_time")
    |> last()
    `;

    const data = await fetchData(fluxQuery);
    res.json(data);
  } catch (error) {
    console.error(error);
  }
}

export async function fetchRequestSecond(req, res) {
  try {
    const { time } = req.query;
    const fluxQuery = `from(bucket: "${BUCKET}")
    |> range(start: -${time})
    |> filter(fn: (r) => r.item == "request_per_second")`;

    const data = await fetchData(fluxQuery);
    res.json(data);
  } catch (error) {
    console.error(error);
  }
}

export async function fetchCPULoad(req, res) {
  try {
    const { time } = req.query;
    const { loadTime } = req.params;
    let fluxQuery = `from(bucket: "${BUCKET}")
    |> range(start: -${time})
    |> filter(fn: (r) => r.item == "load_duration_${loadTime}m")`;

    if (!time.includes('s')) {
      fluxQuery += GROUP_BY_CLAUSE;
    }

    const data = await fetchData(fluxQuery);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.json(error);
  }
}
