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
import { client, SOCKET_KEY } from './utils/redis-util.js';

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

async function messageQueue() {
  while (true) {
    try {
      const { element } = await client.blPop(SOCKET_KEY, 0);
      if (element !== undefined) {
        io.emit('dataUpdate', () => {
          console.log('data is updated');
        });
      }
    } catch (error) {
      await client.connect();
      continue;
    }
  }
}
messageQueue();

export { io };
export default { io };

server.listen(4000, () => {
  console.log('Server is running on port 4000');
});
