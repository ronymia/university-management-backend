import { z } from 'zod';

const createBuildingZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
      invalid_type_error: 'Title must be string',
    }),
  }),
});

const updateBuildingZodSchema = z.object({
  body: z.object({
    title: z.string({ invalid_type_error: 'Title must be string' }).optional(),
  }),
});

export const BuildingValidation = {
  createBuildingZodSchema,
  updateBuildingZodSchema,
};
