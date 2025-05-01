import { RedisClient } from '../../../shared/redis';
import { EVENT_ACADEMIC_SEMESTER_CREATED } from './academicSemester.constant';
import { AcademicSemesterService } from './academicSemester.service';

const initAcademicSemester = () => {
    RedisClient.subscribe(EVENT_ACADEMIC_SEMESTER_CREATED, async (e: any) => {
        const data = JSON.parse(e);
        await AcademicSemesterService.createSemesterFromEvent({
            ...data,
            syncId: data?.id,
        });
    });
};

export const AcademicSemesterEvents = {
    initAcademicSemester,
};
