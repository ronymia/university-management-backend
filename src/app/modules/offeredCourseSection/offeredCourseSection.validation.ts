import { z } from 'zod';
import { isValidTime } from '../../../shared/regex';
import { WeekDays } from '@prisma/client';
import { isStartTimeBeforeEndTime } from '../../../shared/dateTime';

const createOfferedCourseSectionZodValidation = z.object({
  body: z
    .object({
      title: z
        .string({
          required_error: 'title field is required',
          invalid_type_error: 'Title must be string',
        })
        .min(1, 'Title is required'),
      maxCapacity: z
        .number({
          required_error: 'Max Capacity is required',
          invalid_type_error: 'Max Capacity must be number',
        })
        .nonnegative({
          message: 'Max Capacity must be greater than or equal to 0',
        }),
      offeredCourseId: z
        .string({
          required_error: 'offeredCourseId field is required',
          invalid_type_error: 'Offered Course Id must be string',
        })
        .min(1, 'Offered Course Id is required'),
      classSchedules: z.array(
        z.object({
          dayOfWeek: z.enum(Object.values(WeekDays) as [string, ...string[]], {
            required_error: 'dayOfWeek field is required',
            // errorMap: () => {
            //   return {
            //     message: `dayOfWeek must be one of the them ${weekDays.join(', ')}`,
            //   };
            // },
            invalid_type_error: `dayOfWeek must be one of the them ${Object.values(
              WeekDays
            ).join(', ')}`,
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
              { message: `Invalid Time format, expected format is HH:mm` }
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
              { message: `Invalid Time format, expected format is HH:mm` }
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
      ),
    })
    .refine(
      formData => {
        const classSchedules = formData.classSchedules;
        return classSchedules.every(schedule =>
          isStartTimeBeforeEndTime({
            startTime: schedule.startTime,
            endTime: schedule.endTime,
          })
        );
      },
      {
        message: ' Start time should be before End time',
        path: ['endTime'],
      }
    ),
});

const updateOfferedCourseSectionZodValidation = z.object({
  body: z.object({
    title: z
      .string({
        required_error: 'title field is required',
        invalid_type_error: 'Title must be string',
      })
      .min(1, 'Title is required'),
    maxCapacity: z
      .number({
        required_error: 'Max Capacity is required',
        invalid_type_error: 'Max Capacity must be number',
      })
      .nonnegative({
        message: 'Max Capacity must be greater than or equal to 0',
      }),
    offeredCourseId: z
      .string({
        required_error: 'offeredCourseId field is required',
        invalid_type_error: 'Offered Course Id must be string',
      })
      .min(1, 'Offered Course Id is required'),
    // currentEnrolledStudent: z
    //   .number({
    //     required_error: 'currentEnrolledStudent field is required',
    //     invalid_type_error: 'current Enrolled Student must be number',
    //   })
    //   .nonnegative({
    //     message: 'Max Capacity must be greater than or equal to 0',
    //   }),
    // SemesterRegistrationId: z
    //   .string({
    //     required_error: 'SemesterRegistrationId field is required',
    //     invalid_type_error: 'Semester Registration Id must be string',
    //   })
    //   .min(1, 'Semester Registration Id is required'),
  }),
});

export const OfferedCourseSectionValidation = {
  createOfferedCourseSectionZodValidation,
  updateOfferedCourseSectionZodValidation,
};
