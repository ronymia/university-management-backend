import { IOfferedCourseClassScheduleFilterableFields } from './offeredCourseClassSchedule.interface';

export const offeredCourseClassScheduleSearchableFields: IOfferedCourseClassScheduleFilterableFields[] =
  [
    'dayOfWeek',
    'startTime',
    'endTime',
    'roomId',
    'facultyId',
    'offeredCourseSectionId',
    'semesterRegistrationId',
  ];
export const offeredCourseClassScheduleFilterableFields: IOfferedCourseClassScheduleFilterableFields[] =
  [
    'searchTerm',
    'dayOfWeek',
    'startTime',
    'endTime',
    'roomId',
    'facultyId',
    'offeredCourseSectionId',
    'semesterRegistrationId',
  ];

export const EVENT_OFFERED_COURSE_CLASS_SCHEDULE_CREATED =
  'offered-course-class-schedule.created';
export const EVENT_OFFERED_COURSE_CLASS_SCHEDULE_UPDATED =
  'offered-course-class-schedule.updated';
export const EVENT_OFFERED_COURSE_CLASS_SCHEDULE_DELETED =
  'offered-course-class-schedule.deleted';
