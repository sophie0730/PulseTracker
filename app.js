import express from 'express';
import cors from 'cors';
import * as fetch from './controllers/fetch.js';

const app = express();
const VERSION = '1.0';

app.use(cors());
app.use(express.json());

app.use(`/api/${VERSION}/cpu`, fetch.fetchCPU);
app.use(`/api/${VERSION}/memory`, fetch.fetchMemory);
app.use(`/api/${VERSION}/disk/:type`, fetch.fetchDisk);
app.use(`/api/${VERSION}/request`, fetch.fetchHttpRequest);
app.use(`/api/${VERSION}/response`, fetch.fetchResponse);
app.use(`/api/${VERSION}/request-second`, fetch.fetchRequestSecond);
app.use(`/api/${VERSION}/cpu-load/:time`, fetch.fetchCPULoad);

app.listen(4000, () => {
  console.log('Port is opening on 4000');
});
