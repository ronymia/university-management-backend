import { createClient, SetOptions } from 'redis';
import config from '../config';
import { errorLogger, logger } from './logger';

const redisClient = createClient({
    username: config.redis.userName,
    password: config.redis.password,
    socket: {
        host: config.redis.host,
        port: Number(config.redis.port),
        family: 0,
    },
});
const redisPubClient = createClient({
    username: config.redis.userName,
    password: config.redis.password,
    socket: {
        host: config.redis.host,
        port: Number(config.redis.port),
        family: 0,
    },
});
const redisSubClient = createClient({
    username: config.redis.userName,
    password: config.redis.password,
    socket: {
        host: config.redis.host,
        port: Number(config.redis.port),
        family: 0,
    },
});

redisClient.on('connect', () => {
    logger.info('Redis client connected');
});
redisClient.on('error', (err) => {
    errorLogger.error('Redis client error', err);
});

// REDIS CONNECT
const connect = async () => {
    try {
        await Promise.all([
            redisClient.connect(),
            redisPubClient.connect(),
            redisSubClient.connect(),
        ]);

        // VERIFY CONNECTION
        const pong = await redisClient.ping();
        logger.info('Redis client connected', pong);
    } catch (error) {
        errorLogger.error('Redis client error', error);
    }
};

// REDIS SET
const set = async (
    key: string,
    value: string,
    options?: SetOptions,
): Promise<void> => {
    await redisClient.set(key, value, options);
};

// REDIS GET
const get = async (key: string): Promise<string | null> => {
    return await redisClient.get(key);
};

// REDIS DEL
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
