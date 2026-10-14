---
name: database-and-transactions
description: Best practices and patterns for database operations in this monorepo: Prisma transactions in Core Service, Mongoose transactions in Auth Service, Transactional Outbox pattern for Redis events, and standard pagination/filtering. Use when writing database queries, managing transactions, or setting up domain event publishing.
---

# Database, Transactions & Event Publishing Standards

This project uses a polyglot persistence architecture:
- **`core-service`**: PostgreSQL with **Prisma ORM**
- **`auth-service`**: MongoDB with **Mongoose**
- **Cross-Service Communication**: Event publishing via **Transactional Outbox Pattern** and **Redis**

---

## 1. Prisma Transactions (`core-service`)

For multi-table operations or database mutations that emit events, always use **interactive transactions**:

```typescript
const result = await prisma.$transaction(async (tx) => {
  // 1. Perform primary mutation
  const entity = await tx.course.create({
    data: courseData,
  });

  if (!entity) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create entity');
  }

  // 2. Perform related table mutations
  if (relations?.length) {
    await tx.courseToPrerequisite.createMany({
      data: relations.map(r => ({ courseId: entity.id, preRequisiteId: r.id })),
    });
  }

  // 3. Atomically write to Outbox within the same transaction
  await tx.outbox.create({
    data: {
      eventType: EVENT_COURSE_CREATED,
      payload: entity,
      aggregateId: entity.id,
      status: 'PENDING',
    },
  });

  return entity;
});
```

---

## 2. Mongoose Transactions (`auth-service`)

For multi-document writes across collections (e.g. creating `User` and `Student`/`Faculty`/`Admin` profiles):

```typescript
const session = await mongoose.startSession();
try {
  session.startTransaction();

  // 1. Create User
  const newUser = await User.create([userData], { session });
  if (!newUser.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user');
  }

  // 2. Create Profile referencing the user
  profileData.id = newUser[0].id;
  profileData.user = newUser[0]._id;
  const newProfile = await Student.create([profileData], { session });
  if (!newProfile.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create profile');
  }

  // 3. Write to Outbox collection if cross-service sync is needed
  await Outbox.create([{
    eventType: EVENT_STUDENT_CREATED,
    payload: newProfile[0],
    status: 'PENDING'
  }], { session });

  await session.commitTransaction();
  await session.endSession();

  return newProfile[0];
} catch (error) {
  await session.abortTransaction();
  await session.endSession();
  throw error;
}
```

---

## 3. Standard Pagination & Filtering

Always follow the established pagination helper pattern:

1. **Calculate pagination parameters**:
   ```typescript
   const { page, limit, skip, sortBy, sortOrder } =
     paginationHelpers.calculatePagination(paginationOptions);
   ```
2. **Build filter & search conditions**:
   - Collect `searchTerm` into an `OR` condition across `searchableFields`.
   - Collect exact filters into `andConditions`.
3. **Execute count and query in parallel or sequentially**:
   - Always calculate `total` count via `countDocuments()` (Mongoose) or `count({ where })` (Prisma). Never do `result.length` for pagination metadata.
4. **Return standard pagination meta**:
   ```typescript
   return {
     meta: { page, limit, total },
     data: result,
   };
   ```
