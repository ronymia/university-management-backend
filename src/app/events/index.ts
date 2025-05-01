import { AcademicDepartmentEvents } from '../modules/academicDepartment/academicDepartment.event';
import { AcademicFacultyEvents } from '../modules/academicFaculty/academicFaculty.event';
import { AcademicSemesterEvents } from '../modules/academicSemester/academicSemester.event';

const subscribeToEvents = async () => {
    // ACADEMIC SEMESTER
    AcademicSemesterEvents.initAcademicSemester();

    // ACADEMIC FACULTY
    AcademicFacultyEvents.initAcademicFaculty();

    // ACADEMIC DEPARTMENT
    AcademicDepartmentEvents.initAcademicDepartmentEvents();
};

export default subscribeToEvents;
