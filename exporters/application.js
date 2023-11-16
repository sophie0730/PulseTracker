import express from "express";
import cors from "cors";
import * as os from "os";
import * as client from "prom-client";
import * as calculate from "../model/application-calculate.js"

const app = express();
app.use(express.json());
app.use(cors())


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
    name: "http_total_requests",
    help: "http total request",
    async collect() {
      console.log('gauge')
      const totalRequest = await calculate.getNginxAccessLog();
      console.log(totalRequest)
      this.set(totalRequest);
    },
  })
);

app.get("/metrics",  async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.send(await register.metrics());

});
  
  app.listen(9101,'0.0.0.0', () => {
    console.log("The port in openning in 9101");
  });