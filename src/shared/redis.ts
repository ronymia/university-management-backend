import { createClient, SetOptions } from 'redis';
import config from '../config';
import { errorLogger, logger } from './logger';

const redisClient = createClient({
    // url: config.redis.url
    // password: process.env.REDIS_PASSWORD,
    username: 'default',
    password: 'ClYsS2MuKXp7su0HBbjlRGOZ3HbxzzOP',
    socket: {
        host: 'redis-10221.c212.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 10221,
    },
});
const redisPubClient = createClient({
    // url: config.redis.url
    // password: process.env.REDIS_PASSWORD,
    username: 'default',
    password: 'ClYsS2MuKXp7su0HBbjlRGOZ3HbxzzOP',
    socket: {
        host: 'redis-10221.c212.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 10221,
    },
});
const redisSubClient = createClient({
    // url: config.redis.url
    // password: process.env.REDIS_PASSWORD,
    username: 'default',
    password: 'ClYsS2MuKXp7su0HBbjlRGOZ3HbxzzOP',
    socket: {
        host: 'redis-10221.c212.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 10221,
    },
});

redisClient.on('connect', () => {
    logger.info('Redis client connected');
});
redisClient.on('error', (err) => {
    errorLogger.error('Redis client error', err);
});

const connect = async () => {
    await redisClient.connect();
    await redisPubClient.connect();
    await redisSubClient.connect();
};

const set = async (
    key: string,
    value: string,
    options?: SetOptions,
): Promise<void> => {
    await redisClient.set(key, value, options);
};
const get = async (key: string): Promise<string | null> => {
    return await redisClient.get(key);
};
const del = async (key: string): Promise<void> => {
    await redisClient.get(key);
};

const setAccessToken = async (userId: string, token: string): Promise<void> => {
    const key = `access-token:${userId}`;
    const expireTime = Number(config.redis.expires_in);
    await redisClient.set(key, token, { EX: expireTime });
};

const getAccessToken = async (userId: string): Promise<string | null> => {
    const key = `access-token:${userId}`;
    return await redisClient.get(key);
};

const delAccessToken = async (userId: string): Promise<void> => {
    const key = `access-token:${userId}`;
    await redisClient.del(key);
};

const disconnect = async () => {
    await redisClient.quit();
    await redisPubClient.quit();
    await redisSubClient.quit();
};

export const RedisClient = {
    set,
    get,
    del,
    connect,
    disconnect,
    setAccessToken,
    getAccessToken,
    delAccessToken,
    publish: redisPubClient.publish.bind(redisPubClient),
    subscribe: redisSubClient.subscribe.bind(redisSubClient),
    client: redisClient,
};
