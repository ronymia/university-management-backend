---
name: api-security-and-validation
description: Industry-standard security guidelines, Zod request validation, authentication, and error handling for Express backend services. Use when implementing new API endpoints, securing routes, validating user input, handling tokens, or handling errors.
---

# API Security, Validation & Error Handling Standards

Industry-standard practices for securing and validating APIs across `api-gateway`, `auth-service`, and `core-service`.

---

## 1. Request Validation (Zod)

Every mutating endpoint (`POST`, `PUT`, `PATCH`) must validate incoming input before reaching the controller:

1. **Schema Definition**:
   ```typescript
   import { z } from 'zod';

   const createEntityZodSchema = z.object({
     body: z.object({
       title: z.string({ required_error: 'Title is required' }).min(3).trim(),
       code: z.string({ required_error: 'Code is required' }).trim(),
       credits: z.number({ required_error: 'Credits must be a number' }).positive(),
     }),
   });
   ```
2. **Attach to Route**:
   ```typescript
   router.post(
     '/create',
     validateRequest(EntityValidation.createEntityZodSchema),
     EntityController.createEntity
   );
   ```

---

## 2. Authentication & Authorization (RBAC)

1. **Role-Based Access Control**:
   - Protect non-public endpoints with the `auth()` middleware.
   - Always specify the minimum required roles:
     ```typescript
     router.get('/', auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), Controller.getAll);
     ```
2. **Token Management**:
   - **Access Token**: Short-lived, passed in `Authorization: Bearer <token>` header.
   - **Refresh Token**: Stored in an `httpOnly`, `secure` (in production) cookie to protect against XSS:
     ```typescript
     res.cookie('refreshToken', result.refreshToken, {
       secure: config.env === 'production',
       httpOnly: true,
       sameSite: 'strict',
     });
     ```
3. **Password Security**:
   - Passwords must be hashed using `bcrypt` (salt rounds ≥ 10).
   - In Mongoose schemas, always mark `password: { select: 0 }` to avoid accidental exposure.
   - Never log passwords, tokens, or authorization headers in `console.log` or Winston logs.

---

## 3. Defense-in-Depth Security

1. **Rate Limiting**: Apply `express-rate-limit` on authentication and sensitive endpoints (`/auth/login`, `/auth/refresh-token`) to mitigate brute-force attacks.
2. **Security Headers**: Ensure `helmet()` is enabled at the service and gateway entrypoints to prevent common HTTP vulnerabilities (clickjacking, MIME sniffing).
3. **CORS Configuration**: Restrict allowed origins to trusted client URLs; never use wildcard `*` with `credentials: true`.

---

## 4. Error Handling & HTTP Status Codes

- Always use `catchAsync` to avoid unhandled promise rejections.
- Throw typed `ApiError` instances:
  - `httpStatus.BAD_REQUEST` (400) for business rule violations or invalid parameters.
  - `httpStatus.UNAUTHORIZED` (401) for missing/expired tokens or invalid login credentials.
  - `httpStatus.FORBIDDEN` (403) when user lacks permissions for the resource.
  - `httpStatus.NOT_FOUND` (404) when a requested record does not exist.
  - `httpStatus.CONFLICT` (409) for duplicate unique fields (e.g. email, user ID).
