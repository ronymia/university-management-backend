import initStudentEvent from '../modules/student/student.event';

const subscribeToEvents = async () => {
  // STUDENT
  await initStudentEvent();
};

export default subscribeToEvents;
