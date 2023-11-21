/* eslint-disable import/no-extraneous-dependencies */
import redis from 'redis';
<<<<<<< HEAD
=======
import dotenv from 'dotenv';

dotenv.config({ path: '/home/sophie/personal/.env' });
>>>>>>> dc592ac9 (fix: update project structure for adding react frameworke)

// 往後要用aws 用這個
// export const client = redis.createClient({
//   url: `rediss://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
// });

export const SOCKET_KEY = 'socket';
export const client = redis.createClient();

client.on('error', async (err) => {
  console.error('Failed to connect to Redis', err);
  await client.disconnect();
<<<<<<< HEAD
=======
  await client.connect();
>>>>>>> dc592ac9 (fix: update project structure for adding react frameworke)
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

export default { client };
