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
exports.CreditTransactionEntity = exports.CreditTransactionAction = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const admin_user_entity_1 = require("../../admin-users/entities/admin-user.entity");
const credit_package_entity_1 = require("./credit-package.entity");
var CreditTransactionAction;
(function (CreditTransactionAction) {
    CreditTransactionAction["PURCHASE_SUCCESS"] = "purchase_success";
    CreditTransactionAction["USAGE_RESOLUTION"] = "usage_resolution";
    CreditTransactionAction["WELCOME_BONUS"] = "welcome_bonus";
    CreditTransactionAction["ADMIN_ADJUSTMENT"] = "admin_adjustment";
})(CreditTransactionAction || (exports.CreditTransactionAction = CreditTransactionAction = {}));
let CreditTransactionEntity = class CreditTransactionEntity extends base_entity_1.BaseEntity {
    targetUser;
    target_user_id;
    adminUser;
    admin_user_id;
    action;
    amount;
    balance_before;
    balance_after;
    reason;
    payment_gateway;
    gateway_transaction_id;
    gateway_transaction_status;
    gateway_response_payload;
    creditPackage;
    credit_package_id;
};
exports.CreditTransactionEntity = CreditTransactionEntity;
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity),
    (0, typeorm_1.JoinColumn)({ name: 'target_user_id' }),
    __metadata("design:type", user_entity_1.UserEntity)
], CreditTransactionEntity.prototype, "targetUser", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], CreditTransactionEntity.prototype, "target_user_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => admin_user_entity_1.AdminUserEntity, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'admin_user_id' }),
    __metadata("design:type", admin_user_entity_1.AdminUserEntity)
], CreditTransactionEntity.prototype, "adminUser", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], CreditTransactionEntity.prototype, "admin_user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: CreditTransactionAction }),
    __metadata("design:type", String)
], CreditTransactionEntity.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], CreditTransactionEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], CreditTransactionEntity.prototype, "balance_before", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], CreditTransactionEntity.prototype, "balance_after", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CreditTransactionEntity.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], CreditTransactionEntity.prototype, "payment_gateway", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true, unique: true }),
    __metadata("design:type", String)
], CreditTransactionEntity.prototype, "gateway_transaction_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], CreditTransactionEntity.prototype, "gateway_transaction_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], CreditTransactionEntity.prototype, "gateway_response_payload", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => credit_package_entity_1.CreditPackageEntity, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'credit_package_id' }),
    __metadata("design:type", credit_package_entity_1.CreditPackageEntity)
], CreditTransactionEntity.prototype, "creditPackage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], CreditTransactionEntity.prototype, "credit_package_id", void 0);
exports.CreditTransactionEntity = CreditTransactionEntity = __decorate([
    (0, typeorm_1.Entity)('credit_transactions')
], CreditTransactionEntity);
//# sourceMappingURL=credit-transaction.entity.js.map