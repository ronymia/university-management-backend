---
name: api-gateway-routing
description: Routing, reverse-proxying with http-proxy-middleware, auth middleware, and Supabase file uploads in the API Gateway. Use when registering new proxy routes, configuring gateway auth, or handling multipart file uploads.
---

# API Gateway Routing & Proxy Standards

The API Gateway (`services/api-gateway`) is the single entry point for client applications. It is responsible for JWT authentication, request routing, reverse proxying, and file uploads.

---

## 1. Route Mounting & Precedence Rules

Because Express matches routes in order of declaration, **specific nested routes must always be declared before generic prefixes**:

```text
1. Global Auth Middleware (router.use(auth()))
2. Explicit Core Service Custom Routes (e.g. /students/my-courses)
3. Auth Service Routes (e.g. /auth, /users, /students)
4. Core Service Routes (e.g. /courses, /faculties, /semester-registrations)
```

### Critical Example: The `/students` Split
- **Core Custom Routes**: `/students/my-courses`, `/students/my-course-schedules`, `/students/my-academic-info` must route to **`core-service`**.
- **Auth Routes**: General `/students`, `/students/:id` must route to **`auth-service`**.
- *Rule*: Never place general `/students` before `coreCustomRoutes`, otherwise the Auth Service will receive course requests and return `404 Not Found`.

---

## 2. Reverse Proxy Middleware Configuration

When configuring `createProxyMiddleware`, always include `fixRequestBody` and strip duplicate CORS headers:

```typescript
const serviceProxy = createProxyMiddleware({
  target: targetServiceUrl,
  changeOrigin: true,
  pathRewrite: (path, req) => (req as express.Request).originalUrl,
  on: {
    // ⚠️ Required: Re-streams parsed JSON bodies so proxied POST/PUT requests do not hang
    proxyReq: fixRequestBody,

    // ⚠️ Required: Prevent duplicate CORS headers from conflicting with Gateway's CORS config
    proxyRes: (proxyRes) => {
      delete proxyRes.headers['access-control-allow-origin'];
      delete proxyRes.headers['access-control-allow-credentials'];
      delete proxyRes.headers['access-control-allow-methods'];
      delete proxyRes.headers['access-control-allow-headers'];
      delete proxyRes.headers['access-control-expose-headers'];
    },
  },
});
```

---

## 3. Gateway Auth & Public Route Whitelisting

1. **Public Route Whitelist**:
   Unauthenticated endpoints must be added to `publicRoutes` in `gateway/src/app/middlewares/auth.ts`:
   ```typescript
   const publicRoutes = ['/api/v1/auth/login', '/api/v1/auth/refresh-token'];
   if (publicRoutes.includes(req.originalUrl)) {
     return next();
   }
   ```
2. **Bearer Token Validation**:
   Protected endpoints require `Authorization: Bearer <token>`. The Gateway decodes the JWT and attaches the payload to `(req as any).user`.

---

## 4. File Uploads (Supabase Storage)

For endpoints handling file uploads (e.g. profile images):
1. Use `uploadToSupabase(bucket, folder)` middleware:
   - Uses `multer.memoryStorage()`.
   - Uploads file buffer directly to Supabase Storage bucket.
   - Attaches public URL to `req.fileURL`.
2. Downstream services receive the clean URL string rather than handling multipart buffers directly.
