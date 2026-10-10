import { RedisClient } from '../../../shared/redis';
import {
    EVENT_ACADEMIC_DEPARTMENT_CREATED,
    EVENT_ACADEMIC_DEPARTMENT_DELETED,
    EVENT_ACADEMIC_DEPARTMENT_UPDATED,
} from './academicDepartment.constant';
import { AcademicDepartmentService } from './academicDepartment.service';

const initAcademicDepartmentEvents = async () => {
    // CREATE ACADEMIC DEPARTMENT
    RedisClient.subscribe(
        EVENT_ACADEMIC_DEPARTMENT_CREATED,
        async (e: string) => {
            const data = JSON.parse(e);
            await AcademicDepartmentService.createAcademicDepartmentFromEvent({
                ...data,
                syncId: data?.id,
            });
        },
    );

    // UPDATE ACADEMIC DEPARTMENT
    RedisClient.subscribe(
        EVENT_ACADEMIC_DEPARTMENT_UPDATED,
        async (e: string) => {
            const data = JSON.parse(e);
            await AcademicDepartmentService.updateAcademicDepartmentFromEvent({
                ...data,
                syncId: data?.id,
            });
        },
    );

    // DELETE ACADEMIC DEPARTMENT
    RedisClient.subscribe(
        EVENT_ACADEMIC_DEPARTMENT_DELETED,
        async (e: string) => {
            const data = JSON.parse(e);
            await AcademicDepartmentService.deleteAcademicDepartmentFromEvent(
                data?.id,
            );
        },
    );
};

// EXPORT EVENTS
export default initAcademicDepartmentEvents;
