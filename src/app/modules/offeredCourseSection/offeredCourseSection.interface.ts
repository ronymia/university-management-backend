import { WeekDays } from '@prisma/client';

export type IOfferedCourseSectionFilters = {
  searchTerm?: string;
  title?: string;
};

export type IOfferedCourseSectionFilterableField = 'searchTerm' | 'title';

export type IClassSchedule = {
  startTime: string;
  endTime: string;
  roomId: string;
  dayOfWeek: WeekDays;
  facultyId: string;
};

export type IOfferedCourseSectionCreate = {
  title: string;
  maxCapacity: number;
  offeredCourseId: string;
  classSchedules: IClassSchedule[];
};
