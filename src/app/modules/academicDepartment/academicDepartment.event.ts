import { RedisClient } from '../../../shared/redis';
import { EVENT_ACADEMIC_DEPARTMENT_CREATED } from './academicDepartment.constant';
import { AcademicDepartmentService } from './academicDepartment.service';

const initAcademicDepartmentEvents = async () => {
    RedisClient.subscribe(EVENT_ACADEMIC_DEPARTMENT_CREATED, async (e: any) => {
        const data = JSON.parse(e);
        await AcademicDepartmentService.createAcademicDepartmentFromEvent({
            ...data,
            syncId: data?.id,
        });
    });
};

// EXPORT EVENTS
export const AcademicDepartmentEvents = {
    initAcademicDepartmentEvents,
};
