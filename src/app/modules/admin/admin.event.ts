import { Admin } from '@prisma/client';
import { RedisClient } from '../../../shared/redis';
import { EVENT_ADMIN_CREATED } from './admin.constant';
import { AdminService } from './admin.service';

const initAdminEvent = async () => {
  // CREATE ADMIN FROM EVENT
  await RedisClient.subscribe(EVENT_ADMIN_CREATED, async (event: string) => {
    const admin = JSON.parse(event);
    console.log('event', { admin });
    const adminData: Partial<Admin> = {
      adminId: admin.id,
      firstName: admin.name.firstName,
      middleName: admin.name.middleName,
      lastName: admin.name.lastName,
      email: admin.email,
      gender: admin.gender,
      bloodGroup: admin.bloodGroup,
      contactNo: admin.contactNo,
    };
    await AdminService.createAdminFromEvent(adminData);
  });
};

export default initAdminEvent;
