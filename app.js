import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { parsePrometheusMetrics } from './models/parse.js';

const app = express();

app.use(cors());
app.use(express.json());

const SYSTEM_URL = 'http://172.21.73.153:9100/metrics';
const APPLICATION_URL = 'http://172.21.73.153:9101/metrics';

app.get('/metrics', async (req, res) => {
  try {
    const systemResponse = await axios.get(SYSTEM_URL);
    const parseSystem = parsePrometheusMetrics(systemResponse.data);
    const applicationResponse = await axios.get(APPLICATION_URL);
    const parseApplication = parsePrometheusMetrics(applicationResponse.data);
    const parseMetrics = parseSystem.concat(parseApplication);

    res.send(parseMetrics);
  } catch (error) {
    console.error(error);
  }
});

app.listen(4000, () => {
  console.log('Port is opening on 4000');
});
