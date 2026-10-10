import { z } from 'zod';

const createRoomSchema = z.object({
  body: z.object({
    roomNumber: z.string({
      required_error: 'Room Number is required',
      invalid_type_error: 'Room Number must be string',
    }),
    floor: z.string({
      required_error: 'Floor is required',
      invalid_type_error: 'Floor must be string',
    }),
  }),
});

const updateRoomZodSchema = z.object({
  body: z.object({
    roomNumber: z
      .string({
        required_error: 'Room Number is required',
        invalid_type_error: 'Room Number must be string',
      })
      .optional(),
    floor: z
      .string({
        required_error: 'Floor is required',
        invalid_type_error: 'Floor must be string',
      })
      .optional(),
  }),
});

export const RoomValidation = {
  createRoomSchema,
  updateRoomZodSchema,
};
