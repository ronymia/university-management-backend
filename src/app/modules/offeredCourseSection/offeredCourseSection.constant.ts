import { IOfferedCourseSectionFilterableField } from './offeredCourseSection.interface';

export const offeredCourseSectionSearchableFields: IOfferedCourseSectionFilterableField[] =
  ['title'];
export const offeredCourseSectionFilterableFields: IOfferedCourseSectionFilterableField[] =
  ['searchTerm', 'title'];

export const EVENT_OFFERED_COURSE_SECTION_CREATED =
  'offered-course-section.created';
export const EVENT_OFFERED_COURSE_SECTION_UPDATED =
  'offered-course-section.updated';
export const EVENT_OFFERED_COURSE_SECTION_DELETED =
  'offered-course-section.deleted';
