import initAcademicDepartmentEvents from '../modules/academicDepartment/academicDepartment.event';
import initAcademicFaculty from '../modules/academicFaculty/academicFaculty.event';
import initAcademicSemester from '../modules/academicSemester/academicSemester.event';

const subscribeToEvents = async () => {
    // ACADEMIC SEMESTER
    await initAcademicSemester();

    // ACADEMIC FACULTY
    await initAcademicFaculty();

    // ACADEMIC DEPARTMENT
    await initAcademicDepartmentEvents();
};

export default subscribeToEvents;
