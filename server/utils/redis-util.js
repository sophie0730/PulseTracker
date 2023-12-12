/* eslint-disable import/no-extraneous-dependencies */
import redis from 'redis';
// 往後要用aws 用這個
// export const client = redis.createClient({
//   url: `rediss://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
// });

export const PUBSUB_CHANNEL = 'dataUpdateChannel';
export const publisher = redis.createClient();
export const subscriber = redis.createClient();

publisher.on('error', async (err) => {
  console.error('Failed to connect to Subscriber', err);
  await publisher.disconnect();
});

subscriber.on('error', async (err) => {
  console.error('Failed to connect to Subscriber', err);
  await subscriber.disconnect();
});

async function connectPublisher() {
  try {
    await publisher.connect();
    console.log('Connect to Publisher');
  } catch (err) {
    console.error('Failed to connect to Publisher', err);
    await publisher.disconnect();
    await publisher.connect();
  }
}

async function connectSubscriber() {
  try {
    await subscriber.connect();
    console.log('Connect to Subscriber');
  } catch (err) {
    console.error('Failed to connect to Subscriber', err);
    await subscriber.disconnect();
    await subscriber.connect();
  }
}

connectPublisher();
connectSubscriber();

export async function publishUpdateMessage() {
  if (publisher.isReady) {
    publisher.publish(PUBSUB_CHANNEL, 'update');
  }
}
