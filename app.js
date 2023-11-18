import express from 'express';
import cors from 'cors';
import * as fetch from './controllers/fetch.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/cpu', fetch.fetchCPU);
app.listen(4000, () => {
  console.log('Port is opening on 4000');
});
