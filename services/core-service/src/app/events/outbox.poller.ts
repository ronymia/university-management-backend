import { prisma } from '../../shared/prisma';
import { RedisClient } from '../../shared/redis';
import { OutboxEventStatus } from '@prisma/client';

const POLLING_INTERVAL_MS = 5000;

const processOutboxEvents = async () => {
  try {
    const pendingEvents = await prisma.outbox.findMany({
      where: {
        status: OutboxEventStatus.PENDING,
      },
      take: 50,
      orderBy: {
        createdAt: 'asc',
      },
    });

    for (const event of pendingEvents) {
      try {
        await RedisClient.publish(event.eventType, event.payload);

        await prisma.outbox.update({
          where: { id: event.id },
          data: { status: OutboxEventStatus.PUBLISHED },
        });
      } catch (publishError) {
        console.error(
          `Failed to publish event (ID: ${event.id}):`,
          publishError
        );
      }
    }
  } catch (error) {
    console.error('Error in outbox poller:', error);
  }
};

export const startOutboxPoller = () => {
  setInterval(processOutboxEvents, POLLING_INTERVAL_MS);
  // console.log(`Outbox poller started (interval: ${POLLING_INTERVAL_MS}ms)`);
};
