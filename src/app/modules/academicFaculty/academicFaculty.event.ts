import { RedisClient } from '../../../shared/redis';
import {
    EVENT_ACADEMIC_FACULTY_CREATED,
    EVENT_ACADEMIC_FACULTY_DELETED,
    EVENT_ACADEMIC_FACULTY_UPDATED,
} from './academicFaculty.constant';
import { AcademicFacultyService } from './academicFaculty.service';

const initAcademicFaculty = async () => {
    // CREATE ACADEMIC FACULTY
    await RedisClient.subscribe(
        EVENT_ACADEMIC_FACULTY_CREATED,
        async (e: any) => {
            const data = JSON.parse(e);
            console.log({ data });
            await AcademicFacultyService.createAcademicFacultyFromEvent({
                ...data,
                syncId: data?.id,
            });
        },
    );

    // UPDATE ACADEMIC FACULTY
    await RedisClient.subscribe(
        EVENT_ACADEMIC_FACULTY_UPDATED,
        async (e: any) => {
            const data = JSON.parse(e);
            await AcademicFacultyService.updateAcademicFacultyFromEvent({
                ...data,
                syncId: data?.id,
            });
        },
    );

    // DELETE ACADEMIC FACULTY
    await RedisClient.subscribe(
        EVENT_ACADEMIC_FACULTY_DELETED,
        async (e: any) => {
            const data = JSON.parse(e);
            await AcademicFacultyService.deleteAcademicFacultyFromEvent(
                data.id,
            );
        },
    );
};

// EXPORT EVENTS
export default initAcademicFaculty;
