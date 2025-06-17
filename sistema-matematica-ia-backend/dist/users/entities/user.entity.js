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
exports.UserEntity = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
const credit_transaction_entity_1 = require("../../credit-system/entities/credit-transaction.entity");
const user_pwa_role_enum_1 = require("../enums/user-pwa-role.enum");
let UserEntity = class UserEntity extends base_entity_1.BaseEntity {
    name;
    email;
    googleId;
    pictureUrl;
    credits;
    credit_balance;
    role;
    isActive;
    countryOfOrigin;
    credit_transactions;
};
exports.UserEntity = UserEntity;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], UserEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "googleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'picture_url', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "pictureUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], UserEntity.prototype, "credits", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], UserEntity.prototype, "credit_balance", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: user_pwa_role_enum_1.UserPwaRole,
        default: user_pwa_role_enum_1.UserPwaRole.CLIENT,
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'country_origin', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "countryOfOrigin", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => credit_transaction_entity_1.CreditTransactionEntity, (transaction) => transaction.targetUser),
    __metadata("design:type", Array)
], UserEntity.prototype, "credit_transactions", void 0);
exports.UserEntity = UserEntity = __decorate([
    (0, typeorm_1.Entity)('pwa_users')
], UserEntity);
//# sourceMappingURL=user.entity.js.map