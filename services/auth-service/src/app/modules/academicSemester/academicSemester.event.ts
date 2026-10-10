import { RedisClient } from '../../../shared/redis';
import {
    EVENT_ACADEMIC_SEMESTER_CREATED,
    EVENT_ACADEMIC_SEMESTER_DELETED,
    EVENT_ACADEMIC_SEMESTER_UPDATED,
} from './academicSemester.constant';
import { AcademicSemesterService } from './academicSemester.service';

const initAcademicSemester = () => {
    // CREATE ACADEMIC SEMESTER
    RedisClient.subscribe(
        EVENT_ACADEMIC_SEMESTER_CREATED,
        async (e: string) => {
            const data = JSON.parse(e);
            await AcademicSemesterService.createSemesterFromEvent({
                ...data,
                syncId: data?.id,
            });
        },
    );

    // UPDATE ACADEMIC SEMESTER
    RedisClient.subscribe(
        EVENT_ACADEMIC_SEMESTER_UPDATED,
        async (e: string) => {
            const data = JSON.parse(e);
            await AcademicSemesterService.updateAcademicSemesterFromEvent({
                ...data,
                syncId: data?.id,
            });
        },
    );

    // DELETE ACADEMIC SEMESTER
    RedisClient.subscribe(
        EVENT_ACADEMIC_SEMESTER_DELETED,
        async (e: string) => {
            const data = JSON.parse(e);
            await AcademicSemesterService.deleteAcademicSemesterFromEvent(
                data?.id,
            );
        },
    );
};

export default initAcademicSemester;
