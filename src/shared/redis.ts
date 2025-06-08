import { createClient } from 'redis';
import logger from './logger';
import config from '../config';

const redisClient = createClient({
  // url: config.redis.url
  // password: process.env.REDIS_PASSWORD,
  username: config.redis.userName,
  password: config.redis.password,
  socket: {
    host: config.redis.host,
    port: Number(config.redis.port)
  }
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));
redisClient.on('connect', () => logger.info('Redis Client Connected'));

const connect = async (): Promise<void> => {
  await redisClient.connect();
};

export const RedisClient = {
  connect
};

// import { createClient } from 'redis';

// const client = createClient({
//     username: 'default',
//     password: 'ClYsS2MuKXp7su0HBbjlRGOZ3HbxzzOP',
//     socket: {
//         host: 'redis-10221.c212.ap-south-1-1.ec2.redns.redis-cloud.com',
//         port: 10221
//     }
// });

// client.on('error', err => console.log('Redis Client Error', err));

// await client.connect();

// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  // >>> bar
