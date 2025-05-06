import { Student } from '@prisma/client';
import { RedisClient } from '../../../shared/redis';
import { EVENT_STUDENT_CREATED } from './student.constant';
import { StudentService } from './student.service';

const initStudentEvent = async () => {
  // CREATE STUDENT
  await RedisClient.subscribe(EVENT_STUDENT_CREATED, async e => {
    const data: Partial<Student> = JSON.parse(e);
    await StudentService.createStudentFromEvent(data);
  });
};

export default initStudentEvent;
