import initAcademicDepartmentEvents from '../modules/academicDepartment/academicDepartment.event';
import initAcademicFaculty from '../modules/academicFaculty/academicFaculty.event';
import initAcademicSemester from '../modules/academicSemester/academicSemester.event';

const subscribeToEvents = async () => {
    // ACADEMIC SEMESTER
    initAcademicSemester();

    // ACADEMIC FACULTY
    initAcademicFaculty();

    // ACADEMIC DEPARTMENT
    initAcademicDepartmentEvents();
};

export default subscribeToEvents;
