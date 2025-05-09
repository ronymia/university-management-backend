import { ENUM_USER_ROLE } from '../../enums/user';
import { User } from '../modules/user/user.model';

const seedDB = async () => {
    // super admin
    const superAdminData = {
        id: ENUM_USER_ROLE.SUPER_ADMIN,
        role: ENUM_USER_ROLE.SUPER_ADMIN,
        password: '123456',
        needsChangePassword: false,
    };

    // check super admin
    const getSuperAdmin = await User.findOne({ id: superAdminData.id });

    // create super admin
    if (!getSuperAdmin) {
        await User.create(superAdminData);
    }
};

export default seedDB;
