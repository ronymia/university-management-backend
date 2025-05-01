import { RedisClient } from '../../../shared/redis';
import { EVENT_ACADEMIC_FACULTY_CREATED } from './academicFaculty.constant';
import { AcademicFacultyService } from './academicFaculty.service';

const initAcademicFaculty = async () => {
    await RedisClient.subscribe(
        EVENT_ACADEMIC_FACULTY_CREATED,
        async (e: any) => {
            const data = JSON.parse(e);
            await AcademicFacultyService.createAcademicFacultyFromEvent({
                ...data,
                syncId: data?.id,
            });
        },
    );
};

// EXPORT EVENTS
export const AcademicFacultyEvents = {
    initAcademicFaculty,
};
