import { createClient } from 'redis';
import { logger } from './logger';
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
