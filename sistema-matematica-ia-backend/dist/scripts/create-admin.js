"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const admin_users_service_1 = require("../admin-users/admin-users/admin-users.service");
const admin_role_enum_1 = require("../admin-users/enums/admin-role.enum");
async function createAdminUser() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const adminUsersService = app.get(admin_users_service_1.AdminUsersService);
    try {
        const existingAdmin = await adminUsersService.findByUsername('admin');
        if (existingAdmin) {
            console.log('Admin user already exists');
            return;
        }
        const adminUser = await adminUsersService.create({
            username: 'admin',
            password: 'admin123',
            email: 'admin@sistema-matematica.com',
            name: 'Administrator',
            role: admin_role_enum_1.AdminRole.ADMINISTRATOR,
        });
        console.log('Admin user created successfully:', {
            id: adminUser.id,
            username: adminUser.username,
            email: adminUser.email,
            name: adminUser.name,
            role: adminUser.role,
        });
    }
    catch (error) {
        console.error('Error creating admin user:', error);
    }
    finally {
        await app.close();
    }
}
createAdminUser();
//# sourceMappingURL=create-admin.js.map