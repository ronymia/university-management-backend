// import initAdminEvent from '../modules/admin/admin.event';
import initAdminEvent from '../modules/admin/admin.event';
import initFacultyEvent from '../modules/faculty/faculty.event';
import initStudentEvent from '../modules/student/student.event';
import { startOutboxPoller } from './outbox.poller';

const subscribeToEvents = async () => {
  // STUDENT
  await initStudentEvent();
  // ADMIN
  await initAdminEvent();
  // FACULTY
  await initFacultyEvent();

  // START OUTBOX POLLER
  startOutboxPoller();
};

export default subscribeToEvents;
