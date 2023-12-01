/* eslint-disable import/no-extraneous-dependencies */
import redis from 'redis';
// 往後要用aws 用這個
// export const client = redis.createClient({
//   url: `rediss://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
// });

export const SOCKET_KEY = 'socket';
export const client = redis.createClient();

client.on('error', async (err) => {
  console.error('Failed to connect to Redis', err);
  await client.disconnect();
});

async function connectRedis() {
  try {
    await client.connect();
    console.log('Connect to Redis');
  } catch (err) {
    console.error('Failed to connect to Redis', err);
    await client.disconnect();
    await client.connect();
  }
}

connectRedis();

export async function sendMessageQueue() {
  if (client.isReady) {
    client.rPush(SOCKET_KEY, 'update');
  }
}
