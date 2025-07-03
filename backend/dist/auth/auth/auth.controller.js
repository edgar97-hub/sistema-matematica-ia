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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("./auth.service");
const local_auth_guard_1 = require("../guards/local-auth.guard");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const login_dto_1 = require("../dto/login.dto");
const config_1 = require("@nestjs/config");
let AuthController = class AuthController {
    authService;
    configService;
    constructor(authService, configService) {
        this.authService = authService;
        this.configService = configService;
    }
    async getProfile(req) {
        const userId = req.user.id;
        return this.authService.findProfileById(userId);
    }
    async loginAdmin(req, loginDto) {
        return this.authService.loginAdmin(req.user);
    }
    getAdminProfile(req) {
        return {
            id: req.user.id,
            username: req.user.username,
            email: req.user.email,
            name: req.user.name,
            role: req.user.role,
        };
    }
    async googleAuth(req) {
    }
    async googleAuthRedirect(req, res) {
        if (!req.user) {
            const frontendLoginUrl = this.configService.get('FRONTEND_URL') ||
                'http://localhost:3001';
            return res.redirect(`${frontendLoginUrl}/login?error=${encodeURIComponent('Fallo en la autenticación con Google')}`);
        }
        const pwaUser = req.user;
        const loginResult = await this.authService.loginPwaUser(pwaUser);
        const frontendCallbackUrl = `${this.configService.get('FRONTEND_URL') || 'http://localhost:3001'}/auth/google/callback`;
        if (loginResult.access_token) {
            res.redirect(`${frontendCallbackUrl}?token=${loginResult.access_token}`);
        }
        else {
            const frontendLoginUrl = this.configService.get('FRONTEND_URL');
            res.redirect(`${frontendLoginUrl}/login?error=${encodeURIComponent('Error al generar sesión')}`);
        }
    }
    getPwaProfile(req) {
        if ('username' in req.user) {
            return {
                id: req.user.id,
                username: req.user.username,
                email: req.user.email,
                name: req.user.name,
                role: req.user.role,
                type: 'admin',
            };
        }
        else {
            return {
                id: req.user.id,
                email: req.user.email,
                name: req.user.name,
                pictureUrl: req.user.pictureUrl,
                credits: req.user.creditBalance,
                role: req.user.role,
                type: 'pwa',
                countryOfOrigin: req.user.countryOfOrigin,
            };
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.Post)('admin/login'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginAdmin", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('admin/profile'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getAdminProfile", null);
__decorate([
    (0, common_1.Get)('google'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('google/redirect'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthRedirect", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('pwa/profile'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getPwaProfile", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map