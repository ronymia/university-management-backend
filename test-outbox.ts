import mongoose from 'mongoose';
import config from './src/config';
import { Outbox } from './src/app/modules/outbox/outbox.model';

async function runTest() {
    await mongoose.connect(config.database_url as string);
    console.log('Connected to DB');

    const event = await Outbox.create({
        eventType: 'TEST_EVENT',
        payload: JSON.stringify({ hello: 'world' }),
    });

    console.log('Created Outbox Event:', event._id);

    // Check status after 7 seconds (Poller runs every 5 sec)
    setTimeout(async () => {
        const updated = await Outbox.findById(event._id);
        console.log('Final Status:', updated?.status);
        process.exit(0);
    }, 7000);
}

runTest();
