export type IOfferedCourseClassScheduleFilter = {
  searchTerm?: string;
  dayOfWeek?: string;
  startTime?: string;
  endTime?: string;
  roomId?: string;
  facultyId?: string;
  offeredCourseSectionId?: string;
  semesterRegistrationId?: string;
};

export type IOfferedCourseClassScheduleFilterableFields =
  keyof IOfferedCourseClassScheduleFilter;
