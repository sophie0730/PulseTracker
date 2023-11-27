/* eslint-disable no-inner-declarations */
/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-extraneous-dependencies */
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import fetchRouter from './routes/fetch.js';
import dashboardRouter from './routes/dashboard.js';
import alertRouter from './routes/alert.js';
import { client, SOCKET_KEY } from './utils/redis-util.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const viewPath = path.join(__dirname, 'views');
const modelPath = path.join(__dirname, 'models');
const distPath = path.join(__dirname, 'dist');

app.use(cors());
app.use(express.json());
app.use(express.static(viewPath));
app.use(express.static(modelPath));
app.use(express.static(distPath));

app.use(dashboardRouter);
app.use('/api/1.0', [fetchRouter, alertRouter]);

// socket io

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  allowEIO3: true,
});
io.on('connection', () => {
  console.log('connected');
});

export { io };
export default io;

async function messageQueue() {
  while (!client.isReady) {
    await new Promise((resolve) => { setTimeout(resolve, 1000); });
    console.log('waiting for Redis client to be ready');
  }

  while (true) {
    try {
      const { element } = await client.blPop(SOCKET_KEY, 0);
      console.log('queue pop');

      if (element !== undefined) {
        io.emit('dataUpdate', element);
      }
    } catch (error) {
      console.error(`pop error ${error}`);
      continue;
    }
  }

}

server.listen(4000, () => {
  console.log('Server is running on port 4000');
  messageQueue();
});
