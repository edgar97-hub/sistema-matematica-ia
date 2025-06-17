import { Strategy } from 'passport-local';
import { AuthService } from '../auth/auth.service';
import { AdminUserEntity } from '../../admin-users/entities/admin-user.entity';
declare const LocalStrategy_base: new (...args: [] | [options: import("passport-local").IStrategyOptionsWithRequest] | [options: import("passport-local").IStrategyOptions]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class LocalStrategy extends LocalStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(username: string, password: string): Promise<AdminUserEntity>;
}
export {};
