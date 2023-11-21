import express from "express";
import cors from "cors";
import axios from "axios";
const app = express();

app.use(cors());
app.use(express.json());

app.get("/metrics", async (req, res) => {
  try {
    const response = await axios.get("http://13.238.92.214:9100/metrics");
    const parsedMetric = parsePrometheusMetrics(response.data);
    // res.send(response.data);
    res.send(parsedMetric);
  } catch (error) {
    console.error(error);
  }
});

function parsePrometheusMetric(metric) {
  const regex = /(.*?)\{(.*?)\}\s(.*?)$/;
  const match = metric.match(regex);
  if (match) {
    const metricName = match[1];
    const label = match[2];
    const value = match[3];
    return { metricName, label, value };
  } else {
    return null;
  }
}

function parsePrometheusMetrics(metrics) {
  return metrics
    .split("\n")
    .filter((line) => line && !line.startsWith("#"))
    .map((element) => parsePrometheusMetric(element))
    .filter((matric) => matric !== null);
}

app.listen(3000, () => {
  console.log("Port is opening on 3000");
});
