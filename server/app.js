/* eslint-disable no-inner-declarations */
/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-extraneous-dependencies */
import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import fetchRouter from './routes/fetch.js';
import graphRouter from './routes/graph.js';
import dashboardRouter from './routes/dashboard.js';
import alertRouter from './routes/alert.js';
import { subscriber, PUBSUB_CHANNEL } from './utils/redis-util.js';

const app = express();

const viewPath = path.join(process.cwd(), 'views');
const modelPath = path.join(process.cwd(), 'models');
const distPath = path.join(process.cwd(), 'dist');

app.use(cors());
app.use(express.json());
app.use(express.static(viewPath));
app.use(express.static(modelPath));
app.use(express.static(distPath));

app.use(graphRouter);
app.use('/api/1.0', [fetchRouter, alertRouter, dashboardRouter]);

app.use((req, res) => {
  res.status(404).send('PAGE NOT FOUND');
});
// socket io

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  allowEIO3: true,
});
// io.on('connection', () => {
//   console.log('connected');
// });

export { io };
export default io;

async function messageQueue() {
  while (!subscriber.isReady) {
    await new Promise((resolve) => { setTimeout(resolve, 1000); });
    console.log('waiting for Redis client to be ready');
  }

  subscriber.subscribe(PUBSUB_CHANNEL, (message) => {
    io.emit('dataUpdate', message);
  });

}

server.listen(4000, () => {
  console.log('Server is running on port 4000');
  messageQueue();
});
