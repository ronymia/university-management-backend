import initAdminEvent from '../modules/admin/admin.event';
import initFacultyEvent from '../modules/faculty/faculty.event';
import initStudentEvent from '../modules/student/student.event';

const subscribeToEvents = async () => {
  // STUDENT
  await initStudentEvent();
  // ADMIN
  await initAdminEvent();
  // FACULTY
  await initFacultyEvent();
};

export default subscribeToEvents;
