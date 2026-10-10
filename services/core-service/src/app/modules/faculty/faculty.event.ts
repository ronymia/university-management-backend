import { Faculty } from '@prisma/client';
import { RedisClient } from '../../../shared/redis';
import {
  EVENT_FACULTY_CREATED,
  EVENT_FACULTY_DELETED,
  EVENT_FACULTY_UPDATED,
} from './faculty.constant';
import { FacultyService } from './faculty.service';

const initFacultyEvent = async () => {
  // CREATE FACULTY
  await RedisClient.subscribe(EVENT_FACULTY_CREATED, async (event: string) => {
    const faculty = JSON.parse(event);

    const facultyData: Partial<Faculty> = {
      facultyId: faculty.id,
      firstName: faculty.name.firstName,
      middleName: faculty.name.middleName,
      lastName: faculty.name.lastName,
      email: faculty.email,
      contactNo: faculty.contactNo,
      gender: faculty.gender,
      bloodGroup: faculty.bloodGroup,
      designation: faculty.designation,
      academicDepartmentId: faculty.academicDepartment.syncId,
      academicFacultyId: faculty.academicFaculty.syncId,
    };

    await FacultyService.createFacultyFromEvent(facultyData);
  });

  // UPDATE FACULTY
  await RedisClient.subscribe(EVENT_FACULTY_UPDATED, async (event: string) => {
    const faculty = JSON.parse(event);

    const facultyData: Partial<Faculty> = {
      facultyId: faculty.id,
      firstName: faculty.name.firstName,
      middleName: faculty.name.middleName,
      lastName: faculty.name.lastName,
      email: faculty.email,
      contactNo: faculty.contactNo,
      gender: faculty.gender,
      bloodGroup: faculty.bloodGroup,
      designation: faculty.designation,
      academicDepartmentId: faculty.academicDepartment.syncId,
      academicFacultyId: faculty.academicFaculty.syncId,
    };

    await FacultyService.updateFacultyFromEvent(facultyData);
  });

  // DELETE FACULTY
  await RedisClient.subscribe(EVENT_FACULTY_DELETED, async (event: string) => {
    const faculty = JSON.parse(event);
    await FacultyService.deleteFacultyFromEvent(faculty.id);
  });
};

export default initFacultyEvent;
