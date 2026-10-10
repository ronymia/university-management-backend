import axios, { AxiosInstance } from 'axios';
import { logger } from './logger';
import config from '../config';

const HttpService = (baseUrl: string): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Add request interceptor to log requests
  axiosInstance.interceptors.request.use(
    (config) => {
      logger.info(`Request made to ${config.url}`);
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor to log responses
  axiosInstance.interceptors.response.use(
    (response) => {
      logger.info(`Response received from ${response.config.url}`);
      return response.data;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

const AuthService = HttpService(config.authServiceUrl);
const CoreService = HttpService(config.coreServiceUrl);

export { HttpService, AuthService, CoreService };
