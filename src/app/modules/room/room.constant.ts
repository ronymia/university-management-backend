export const roomSearchableFields: string[] = ['roomNumber', 'floor'];

export const roomFilterableFields: string[] = [
  'searchTerm',
  'roomNumber',
  'floor',
  'buildingId',
];

export const EVENT_ROOM_CREATED = 'room.created';
export const EVENT_ROOM_UPDATED = 'room.updated';
export const EVENT_ROOM_DELETED = 'room.deleted';
