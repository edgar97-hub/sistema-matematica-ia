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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const admin_users_service_1 = require("../../admin-users/admin-users/admin-users.service");
const users_service_1 = require("../../users/users/users.service");
const system_configuration_service_1 = require("../../system-configuration/services/system-configuration.service");
const credit_service_1 = require("../../credit-system/services/credit.service");
const credit_transaction_entity_1 = require("../../credit-system/entities/credit-transaction.entity");
let AuthService = class AuthService {
    adminUsersService;
    usersService;
    jwtService;
    systemConfigurationService;
    creditService;
    constructor(adminUsersService, usersService, jwtService, systemConfigurationService, creditService) {
        this.adminUsersService = adminUsersService;
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.systemConfigurationService = systemConfigurationService;
        this.creditService = creditService;
    }
    async findProfileById(userId) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado.');
        }
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            pictureUrl: user.pictureUrl,
            countryOfOrigin: user.countryOfOrigin,
            credits: user.creditBalance,
            role: user.role,
        };
    }
    async loginAdmin(user) {
        const payload = {
            sub: user.id,
            username: user.username,
            role: user.role,
            type: 'admin',
        };
        return {
            accessToken: this.jwtService.sign(payload),
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        };
    }
    async validateAdmin(username, password) {
        return this.adminUsersService.validateUser(username, password);
    }
    async findOrCreatePwaUser(profile) {
        const user = await this.usersService.findOrCreateFromGoogle(profile);
        let creditIsAssigned = user.creditTransactions?.some((item) => item.action === credit_transaction_entity_1.CreditTransactionAction.WELCOME_BONUS);
        if (user.googleId && !creditIsAssigned) {
            const config = await this.systemConfigurationService.getConfiguration();
            if (config.welcomeCreditEnabled) {
                await this.creditService.addWelcomeCredits(user.id, config.welcomeCreditAmount);
                const updatedUser = await this.usersService.findById(user.id);
                if (updatedUser) {
                    return updatedUser;
                }
                else {
                    throw new common_1.NotFoundException(`User with ID "${user.id}" not found after adding welcome credits`);
                }
            }
        }
        return user;
    }
    async loginPwaUser(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            type: 'pwa',
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                profile_picture: user.pictureUrl,
                creditBalance: user.creditBalance,
                role: user.role,
            },
        };
    }
    async validateJwtPayload(payload) {
        if (payload.type === 'admin') {
            return this.adminUsersService.findById(payload.sub);
        }
        else if (payload.type === 'pwa') {
            return this.usersService.findById(payload.sub);
        }
        return null;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [admin_users_service_1.AdminUsersService,
        users_service_1.UsersService,
        jwt_1.JwtService,
        system_configuration_service_1.SystemConfigurationService,
        credit_service_1.CreditService])
], AuthService);
//# sourceMappingURL=auth.service.js.map