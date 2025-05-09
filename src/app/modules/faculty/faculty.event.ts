import { Faculty } from '@prisma/client';
import { RedisClient } from '../../../shared/redis';
import { EVENT_FACULTY_CREATED } from './faculty.constant';
import { FacultyService } from './faculty.service';

const initFacultyEvent = async () => {
  // CREATE FACULTY
  await RedisClient.subscribe(EVENT_FACULTY_CREATED, async (event: string) => {
    const faculty = JSON.parse(event);

    const facultyData: Partial<Faculty> = {
      id: faculty.id,
      firstName: faculty.name.firstName,
      middleName: faculty.name.middleName,
      lastName: faculty.name.lastName,
      email: faculty.email,
      contactNo: faculty.contactNo,
      gender: faculty.gender,
      bloodGroup: faculty.bloodGroup,
      designation: faculty.designation,
      academicDepartmentId: faculty.academicDepartment,
      academicSemesterId: faculty.academicSemester,
    };

    await FacultyService.createFacultyFromEvent(facultyData);
  });
};

export default initFacultyEvent;
