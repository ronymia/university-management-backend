import { Student } from '@prisma/client';
import { RedisClient } from '../../../shared/redis';
import {
  EVENT_STUDENT_CREATED,
  EVENT_STUDENT_UPDATED,
} from './student.constant';
import { StudentService } from './student.service';

const initStudentEvent = async () => {
  // CREATE STUDENT
  await RedisClient.subscribe(EVENT_STUDENT_CREATED, async e => {
    const student = JSON.parse(e);
    const studentData: Partial<Student> = {
      studentId: student?.id,
      firstName: student?.name?.firstName,
      middleName: student?.name?.middleName,
      lastName: student?.name?.lastName,
      email: student?.email,
      contactNo: student?.contactNo,
      emergencyContactNo: student?.emergencyContactNo,
      gender: student?.gender,
      bloodGroup: student?.bloodGroup,
      dateOfBirth: student?.dateOfBirth,
      profileImage: student?.profileImage,
      academicSemesterId: student?.academicSemester?.syncId,
      academicDepartmentId: student?.academicDepartment?.syncId,
      academicFacultyId: student?.academicFaculty?.syncId,
    };
    await StudentService.createStudentFromEvent(studentData);
  });

  // UPDATE STUDENT
  await RedisClient.subscribe(EVENT_STUDENT_UPDATED, async e => {
    const student = JSON.parse(e);
    const studentData: Partial<Student> = {
      studentId: student?.id,
      firstName: student?.name?.firstName,
      middleName: student?.name?.middleName,
      lastName: student?.name?.lastName,
      email: student?.email,
      contactNo: student?.contactNo,
      emergencyContactNo: student?.emergencyContactNo,
      gender: student?.gender,
      bloodGroup: student?.bloodGroup,
      dateOfBirth: student?.dateOfBirth,
      profileImage: student?.profileImage,
      academicSemesterId: student?.academicSemester?.syncId,
      academicDepartmentId: student?.academicDepartment?.syncId,
      academicFacultyId: student?.academicFaculty?.syncId,
    };
    // console.log({ student });
    await StudentService.updateStudentFromEvent(studentData);
  });
};

export default initStudentEvent;
