import { z } from 'zod';
import { weekDays } from '../../../constants';
import { isStartTimeBeforeEndTime } from '../../../shared/dateTime';
import { isValidTime } from '../../../shared/regex';

const createOfferedCourseClassScheduleZodValidation = z.object({
  body: z
    .object({
      offeredCourseSectionId: z
        .string({
          required_error: 'offeredCourseSectionId field is required',
          invalid_type_error: 'Offered Course Section Id must be string',
        })
        .min(1, 'Please Provide Offered Course Section Id'),
      dayOfWeek: z.enum(weekDays as [string, ...string[]], {
        required_error: 'dayOfWeek field is required',
        // errorMap: () => {
        //   return {
        //     message: `dayOfWeek must be one of the them ${weekDays.join(', ')}`,
        //   };
        // },
        invalid_type_error: `dayOfWeek must be one of the them ${weekDays.join(
          ', '
        )}`,
      }),
      startTime: z
        .string({
          required_error: 'startTime field is required',
          invalid_type_error: 'Start Time must be string',
        })
        .min(1, 'Start Time is required')
        .refine(
          data => {
            return isValidTime(data);
          },
          { message: `Invalid Time format, expected format is HH:MM` }
        ),
      endTime: z
        .string({
          required_error: 'endTime field is required',
          invalid_type_error: 'End Time must be string',
        })
        .min(1, 'End Time is required')
        .refine(
          data => {
            return isValidTime(data);
          },
          { message: `Invalid Time format, expected format is HH:MM` }
        ),
      roomId: z
        .string({
          required_error: 'roomId field is required',
          invalid_type_error: 'Room Id must be string',
        })
        .min(1, 'Room Id is required'),
      facultyId: z
        .string({
          required_error: 'facultyId field is required',
          invalid_type_error: 'Faculty Id must be string',
        })
        .min(1, 'Faculty Id is required'),
    })
    .refine(
      formData => {
        return isStartTimeBeforeEndTime({
          startTime: formData.startTime,
          endTime: formData.endTime,
        });
      },
      {
        message: ' Start time should be before End time',
        path: ['endTime'],
      }
    ),
});

const updateOfferedCourseClassScheduleZodValidation = z.object({
  body: z.object({
    offeredCourseSectionId: z
      .string({
        required_error: 'offeredCourseSectionId field is required',
        invalid_type_error: 'Offered Course Section Id must be string',
      })
      .min(1, 'Please Provide Offered Course Section Id')
      .optional(),
    dayOfWeek: z
      .enum(weekDays as [string, ...string[]], {
        required_error: 'dayOfWeek field is required',
        invalid_type_error: `dayOfWeek must be one of the them ${weekDays.join(
          ', '
        )}`,
      })
      .optional(),
    startTime: z
      .string({
        required_error: 'startTime field is required',
        invalid_type_error: 'Start Time must be string',
      })
      .min(1, 'Start Time is required')
      .optional(),
    endTime: z
      .string({
        required_error: 'endTime field is required',
        invalid_type_error: 'End Time must be string',
      })
      .min(1, 'End Time is required')
      .optional(),
    roomId: z
      .string({
        required_error: 'roomId field is required',
        invalid_type_error: 'Room Id must be string',
      })
      .min(1, 'Room Id is required')
      .optional(),
    facultyId: z
      .string({
        required_error: 'facultyId field is required',
        invalid_type_error: 'Faculty Id must be string',
      })
      .min(1, 'Faculty Id is required')
      .optional(),
  }),
});

export const OfferedCourseClassScheduleValidation = {
  createOfferedCourseClassScheduleZodValidation,
  updateOfferedCourseClassScheduleZodValidation,
};
