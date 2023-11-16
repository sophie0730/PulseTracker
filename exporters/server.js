import express from "express";
import cors from "cors";
import * as os from "os";
import * as client from "prom-client";
import * as calculate from "../model/server-calculate.js"

const app = express();
app.use(express.json());
app.use(cors());

const register = new client.Registry();
const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics({
  app: "node-exporter-2.0",
  timeout: 10000,
  gcDurationBuckets: [1, 2, 5, 7, 9],
  register,
});

register.registerMetric(
  new client.Gauge({
    name: "node_load_duration_1m",
    help: "Average Load duration 1m",
    collect() {
      const load = os.loadavg()[0];
      this.set(load);
    },
  })
);

register.registerMetric(
  new client.Gauge({
    name: "node_load_duration_5m",
    help: "Average Load duration 5m",
    collect() {
      const load = os.loadavg()[1];
      this.set(load);
    },
  })
);

register.registerMetric(
  new client.Gauge({
    name: "node_load_duration_15m",
    help: "Average Load duration 15m",
    collect() {
      const load = os.loadavg()[2];
      this.set(load);
    },
  })
);

register.registerMetric(
  new client.Gauge({
    name: "node_CPU_Average_Usage",
    help: "Average CPU usage",
    collect() {
      const CPUsage = calculate.getCPUInfo();
      this.set(CPUsage);
    },
  })
);

register.registerMetric(
  new client.Gauge({
    name: "node_Memory_Usage",
    help: "Memory usage",
    collect() {
      const memoryUsage = calculate.getMemoryUsage();

      this.set(memoryUsage);
    },
  })
);

app.get("/metrics", async (req, res) => {
  const info = calculate.diskRead();
  console.log(info)
  res.set("Content-Type", register.contentType);
  res.send(await register.metrics());
});

app.listen(9100,'0.0.0.0', () => {
  console.log("The port in openning in 9100");
});
