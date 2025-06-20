"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const admin_user_entity_1 = require("../entities/admin-user.entity");
const admin_role_enum_1 = require("../enums/admin-role.enum");
let AdminUsersService = class AdminUsersService {
    adminUserRepository;
    constructor(adminUserRepository) {
        this.adminUserRepository = adminUserRepository;
    }
    async findByUsername(username) {
        return this.adminUserRepository.findOne({
            where: { username, isActive: true },
        });
    }
    async findById(id) {
        return this.adminUserRepository.findOne({
            where: { id, isActive: true },
        });
    }
    async create(adminUserData) {
        const adminUser = this.adminUserRepository.create({
            ...adminUserData,
            role: adminUserData.role || admin_role_enum_1.AdminRole.ADMINISTRATOR,
        });
        return this.adminUserRepository.save(adminUser);
    }
    async validateUser(username, password) {
        const user = await this.findByUsername(username);
        if (user && (await user.validatePassword(password))) {
            return user;
        }
        return null;
    }
    async findAll() {
        return this.adminUserRepository.find({
            where: { isActive: true },
            select: [
                'id',
                'username',
                'email',
                'name',
                'role',
                'createdAt',
                'updatedAt',
            ],
        });
    }
};
exports.AdminUsersService = AdminUsersService;
exports.AdminUsersService = AdminUsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(admin_user_entity_1.AdminUserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AdminUsersService);
//# sourceMappingURL=admin-users.service.js.map