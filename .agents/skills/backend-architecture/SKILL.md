---
name: backend-architecture
description: Architecture, coding standards, and layered patterns for the University Management Backend microservices (Gateway, Auth Service, Core Service). Use when creating or refactoring routes, controllers, services, validations, database models, or transactions.
---

# University Management Backend Architecture & Standards

Defines the architecture, code structure, and development standards for the backend microservices (`api-gateway`, `auth-service`, `core-service`).

## 1. Architectural Layers

Each service module follows a strict 4-tier separation of concerns:

```text
Route -> Validation (Zod) -> Controller -> Service -> Model / Database
```

1. **Route (`*.route.ts`)**:
   - Defines HTTP endpoints and HTTP verbs.
   - Attaches `auth()` middleware with appropriate roles (`ENUM_USER_ROLE`).
   - Attaches request validation (`validateRequest(ValidationSchema)`).
   - Maps directly to controller methods (no business logic here).

2. **Validation (`*.validation.ts`)**:
   - Uses **Zod** to validate request payload structure (`body`, `query`, `cookies`, `params`).
   - Keeps types and schemas strict and colocated.

3. **Controller (`*.controller.ts`)**:
   - Wrapped with `catchAsync` utility to automatically pass async errors to `next()`.
   - Extracts data from `req.body`, `req.params`, `req.query`, and `req.user`.
   - Delegates business operations directly to the Service layer.
   - Formats success responses using `sendResponse<T>(res, { ... })`.
   - No direct database queries or complex domain logic in controllers.

4. **Service (`*.service.ts`)**:
   - Implements pure business logic, calculations, and data persistence.
   - Manages transactions (e.g. Mongoose sessions or Prisma transactions).
   - Throws `ApiError(statusCode, message)` when domain constraints fail.

5. **Model (`*.model.ts` / `*.interface.ts`)**:
   - Defines Mongoose schemas, interfaces, virtuals, and custom static/instance methods.

---

## 2. Data Integrity & Transactions

- **Multi-document Writes**: For operations affecting multiple collections (e.g. creating User + Student/Faculty/Admin), **always** use a database session/transaction.
- **Transactional Outbox Pattern**: When emitting cross-service domain events via Redis, save the event in the outbox collection within the same transaction to guarantee eventual consistency.

---

## 3. Error Handling & Responses

- **Standard Response Shape**:
  ```ts
  sendResponse<T>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Operation successful!',
      meta: paginationMeta, // if applicable
      data: result,
  });
  ```
- **Error Propagation**: Always throw `ApiError` with appropriate `httpStatus` codes (`BAD_REQUEST`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`).

---

## 4. Coding Conventions

- **TypeScript**: Strict typing; avoid `any`. Use descriptive `I`-prefixed interfaces (e.g., `IUser`, `ILoginUserResponse`).
- **Imports**: Clean import structure; do not create circular dependencies across services.
- **Passwords & Secrets**: Never log credentials or tokens. Passwords must be hashed via bcrypt in model hooks.
