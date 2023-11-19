import { BUCKET } from '../utils/influxdb-utils.js';
import { fetchData } from '../models/fetch.js';

export async function fetchCPU(req, res) {
  try {
    const { time } = req.query;
    const fluxQuery = `from(bucket: "${BUCKET}")
    |> range(start: -${time})
    |> filter(fn: (r) => r.item == "cpu_average_usage")`;

    const data = await fetchData(fluxQuery);
    res.json(data);
  } catch (error) {
    console.log(error);
  }
}

export async function fetchMemory(req, res) {
  try {
    const { time } = req.query;
    const fluxQuery = `from(bucket: "${BUCKET}")
    |> range(start: -${time}h)
    |> filter(fn: (r) => r.item == "memory_usage")`;

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
    const fluxQuery = `from(bucket: "${BUCKET}")
    |> range(start: -${time})
    |> filter(fn: (r) => r.item == "disk_${type}_average_time")`;

    const data = await fetchData(fluxQuery);
    res.json(data);
  } catch (error) {
    console.error(error);
  }
}

export async function fetchHttpRequest(req, res) {
  try {
    const { time } = req.query;
    const fluxQuery = `from(bucket: "${BUCKET}")
    |> range(start: -${time})
    |> filter(fn: (r) => r.item == "http_total_requests")`;

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
    |> filter(fn: (r) => r.item == "max_response_time")`;

    const data = await fetchData(fluxQuery);
    res.json(data);
  } catch (error) {
    console.error(error);
  }
}

// TBD
export async function fetchRequestSecond(req, res) {
  try {
    const { time } = req.query;
    const fluxQuery = `from(bucket: "${BUCKET}")
    |> range(start: -${time})
    |> filter(fn: (r) => r.item == "")`;

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
    const fluxQuery = `from(bucket: "${BUCKET}")
    |> range(start: -${time})
    |> filter(fn: (r) => r.item == "load_duration_${loadTime}m")`;

    const data = await fetchData(fluxQuery);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.json(error);
  }
}
