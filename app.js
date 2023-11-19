import express from 'express';
import cors from 'cors';
import fetchRouter from './routes/fetch.js';
import dashboardRouter from './routes/dashboard.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(dashboardRouter);
app.use('/api/1.0', fetchRouter);

app.listen(4000, () => {
  console.log('Port is opening on 4000');
});
