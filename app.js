import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fetchRouter from './routes/fetch.js';
import dashboardRouter from './routes/dashboard.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const viewPath = path.join(__dirname, 'views');
const modelPath = path.join(__dirname, 'models');

app.use(cors());
app.use(express.json());
app.use(express.static(viewPath));
app.use(express.static(modelPath));

app.use(dashboardRouter);
app.use('/api/1.0', fetchRouter);

app.listen(4000, () => {
  console.log('Port is opening on 4000');
});
