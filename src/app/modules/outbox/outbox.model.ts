import { Schema, model } from 'mongoose';
import { IOutbox, OutboxModel } from './outbox.interface';

const OutboxSchema = new Schema<IOutbox, OutboxModel>(
    {
        eventType: {
            type: String,
            required: true,
        },
        payload: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['PENDING', 'PUBLISHED'],
            default: 'PENDING',
        },
    },
    {
        timestamps: true,
    },
);

export const Outbox = model<IOutbox, OutboxModel>('Outbox', OutboxSchema);
