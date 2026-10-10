import { Model, Document } from 'mongoose';

export type IOutbox = {
    eventType: string;
    payload: string;
    status: 'PENDING' | 'PUBLISHED';
};

export type OutboxModel = Model<IOutbox, Record<string, unknown>>;
