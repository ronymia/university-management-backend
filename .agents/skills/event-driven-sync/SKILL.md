---
name: event-driven-sync
description: Cross-service event synchronization standards using the Transactional Outbox Pattern and Redis Pub/Sub between Auth Service (MongoDB) and Core Service (PostgreSQL/Prisma). Use when creating new events, syncing data between services, or debugging event delivery.
---

# Cross-Service Event Synchronization (Outbox & Redis Pub/Sub)

This monorepo uses an **asynchronous event-driven architecture** to synchronize data between **Auth Service** (MongoDB) and **Core Service** (PostgreSQL/Prisma) without distributed locking or temporal coupling.

---

## 1. Architectural Flow

```text
[ Primary Service Mutation ]
       │
       ▼ (Atomic Transaction)
[ DB Entity Created ] ───► [ Outbox Record Created (status: PENDING) ]
                                      │
                                      ▼ (Poller every 5s)
                            [ RedisClient.publish(eventType, payload) ]
                                      │
                                      ▼
                            [ Outbox Record Marked (status: PUBLISHED) ]
                                      │
                                      ▼ (Redis Pub/Sub)
                            [ Subscriber Service (init<Entity>Event) ]
                                      │
                                      ▼
                            [ Mirror DB Entity Upserted ]
```

---

## 2. Event Publishing Checklist

When adding a sync event from a publishing service:

1. **Define Event Constants**: Colocate event constants in `<entity>.constant.ts`:
   ```typescript
   export const EVENT_STUDENT_CREATED = 'student.created';
   export const EVENT_STUDENT_UPDATED = 'student.updated';
   export const EVENT_STUDENT_DELETED = 'student.deleted';
   ```

2. **Atomic Write to Outbox (Inside Transaction)**:
   Never publish directly to Redis in your service function. Always create an Outbox entry inside the database transaction:
   - **In Prisma (`core-service`)**:
     ```typescript
     await tx.outbox.create({
       data: {
         eventType: EVENT_COURSE_CREATED,
         payload: JSON.stringify(createdCourse),
         status: 'PENDING',
       },
     });
     ```
   - **In Mongoose (`auth-service`)**:
     ```typescript
     await Outbox.create([{
       eventType: EVENT_STUDENT_CREATED,
       payload: JSON.stringify(newStudent[0]),
       status: 'PENDING',
     }], { session });
     ```

3. **Outbox Poller Dispatch**:
   The poller (`outbox.poller.ts`) fetches pending events with `take: 50` ordered by `createdAt: asc`, publishes them via `RedisClient.publish`, and marks them `PUBLISHED`.

---

## 3. Event Subscribing Checklist

When receiving and mirroring data in the subscriber service:

1. **Create Event Listener (`<entity>.event.ts`)**:
   ```typescript
   import { RedisClient } from '../../../shared/redis';
   import { EVENT_STUDENT_CREATED } from './student.constant';
   import { StudentService } from './student.service';

   const initStudentEvent = async () => {
     await RedisClient.subscribe(EVENT_STUDENT_CREATED, async (data: string) => {
       const payload = JSON.parse(data);
       await StudentService.createStudentFromEvent(payload);
     });
   };

   export default initStudentEvent;
   ```

2. **Register in Event Hub (`src/app/events/index.ts`)**:
   Ensure the listener is registered inside `subscribeToEvents()` so it begins listening upon service startup.

3. **Idempotent Upsert in Service**:
   Network retries or re-polls may deliver the same event twice. Always use **upsert** or check for existence before writing:
   ```typescript
   // In Prisma
   await prisma.student.upsert({
     where: { studentId: payload.id },
     update: mappedData,
     create: { ...mappedData, studentId: payload.id },
   });
   ```

4. **Sync ID Cross-Referencing**:
   - `AcademicSemester`, `AcademicDepartment`, and `AcademicFaculty` entities must use `syncId` to correlate MongoDB `_id` with PostgreSQL UUIDs.
