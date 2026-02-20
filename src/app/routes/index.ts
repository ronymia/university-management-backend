import express from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import config from '../../config';

const router = express.Router();

const authServiceProxy = createProxyMiddleware({
  target: config.authServiceUrl,
  changeOrigin: true,
  pathRewrite: (path, req) => (req as express.Request).originalUrl,
  on: {
    proxyReq: fixRequestBody,
    proxyRes: (proxyRes) => {
      delete proxyRes.headers['access-control-allow-origin'];
      delete proxyRes.headers['access-control-allow-credentials'];
      delete proxyRes.headers['access-control-allow-methods'];
      delete proxyRes.headers['access-control-allow-headers'];
      delete proxyRes.headers['access-control-expose-headers'];
    }
  }
});

const coreServiceProxy = createProxyMiddleware({
  target: config.coreServiceUrl,
  changeOrigin: true,
  pathRewrite: (path, req) => (req as express.Request).originalUrl,
  on: {
    proxyReq: fixRequestBody,
    proxyRes: (proxyRes) => {
      delete proxyRes.headers['access-control-allow-origin'];
      delete proxyRes.headers['access-control-allow-credentials'];
      delete proxyRes.headers['access-control-allow-methods'];
      delete proxyRes.headers['access-control-allow-headers'];
      delete proxyRes.headers['access-control-expose-headers'];
    }
  }
});

// Explicit Core Service endpoints nested under Auth-centric roots
const coreCustomRoutes = [
  '/students/my-courses',
  '/students/my-course-schedules',
  '/students/my-academic-info',
  '/faculties/my-courses',
  '/faculties/my-course-students',
  '/faculties/:id/assigned-courses',
  '/faculties/:id/remove-courses'
];

coreCustomRoutes.forEach((route) => {
  router.use(route, coreServiceProxy);
});

// Auth Service Routes
const authRoutes = [
  '/auth',
  '/users',
  '/admins',
  '/faculties',
  '/students',
  '/management-departments'
];

authRoutes.forEach((route) => {
  router.use(route, authServiceProxy);
});

// Core Service Routes
const coreRoutes = [
  '/academic-semesters',
  '/academic-faculties',
  '/academic-departments',
  '/buildings',
  '/rooms',
  '/courses',
  '/offered-courses',
  '/offered-course-sections',
  '/offered-course-class-schedules',
  '/semester-registrations',
  '/student-enrolled-courses',
  '/student-enrolled-course-marks',
  '/student-semester-payments'
];

coreRoutes.forEach((route) => {
  router.use(route, coreServiceProxy);
});

export default router;
