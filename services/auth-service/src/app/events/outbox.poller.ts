import { logger, errorLogger } from '../../shared/logger';
import { RedisClient } from '../../shared/redis';
import { Outbox } from '../modules/outbox/outbox.model';

const POLLING_INTERVAL_MS = 5000;

export const startOutboxPoller = () => {
    logger.info('Started Outbox Poller for reliable event publishing...');

    setInterval(async () => {
        try {
            // Find all pending events
            const pendingEvents = await Outbox.find({ status: 'PENDING' });

            if (pendingEvents.length === 0) return;

            // Attempt to publish each event to Redis
            for (const event of pendingEvents) {
                try {
                    await RedisClient.publish(event.eventType, event.payload);

                    // Mark as published
                    event.status = 'PUBLISHED';
                    await event.save();

                    logger.info(
                        `Successfully published outbox event: ${event.eventType}`,
                    );
                } catch (publishError) {
                    errorLogger.error(
                        `Failed to publish event ${event.eventType}, will retry next cycle`,
                        publishError,
                    );
                }
            }
        } catch (error) {
            errorLogger.error(
                'Outbox Poller encountered a database error:',
                error,
            );
        }
    }, POLLING_INTERVAL_MS);
};
