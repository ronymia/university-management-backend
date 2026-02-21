import initAcademicDepartmentEvents from '../modules/academicDepartment/academicDepartment.event';
import initAcademicFaculty from '../modules/academicFaculty/academicFaculty.event';
import initAcademicSemester from '../modules/academicSemester/academicSemester.event';
import { startOutboxPoller } from './outbox.poller';

const subscribeToEvents = async () => {
    // ACADEMIC SEMESTER
    await initAcademicSemester();

    // ACADEMIC FACULTY
    await initAcademicFaculty();

    // ACADEMIC DEPARTMENT
    await initAcademicDepartmentEvents();

    // OUTBOX POLLER
    startOutboxPoller();
};

export default subscribeToEvents;
