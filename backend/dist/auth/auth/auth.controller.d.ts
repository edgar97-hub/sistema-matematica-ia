import { AuthService } from './auth.service';
import { LoginDto } from '../dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
export declare class AuthController {
    private authService;
    private configService;
    constructor(authService: AuthService, configService: ConfigService);
    getProfile(req: any): Promise<any>;
    loginAdmin(req: any, loginDto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: number;
            username: string;
            email: string;
            name: string;
            role: import("../../admin-users/enums/admin-role.enum").AdminRole;
        };
    }>;
    getAdminProfile(req: any): {
        id: any;
        username: any;
        email: any;
        name: any;
        role: any;
    };
    googleAuth(req: any): Promise<void>;
    googleAuthRedirect(req: any, res: Response): Promise<void>;
    getPwaProfile(req: any): {
        id: any;
        username: any;
        email: any;
        name: any;
        role: any;
        type: string;
        pictureUrl?: undefined;
        credits?: undefined;
        countryOfOrigin?: undefined;
    } | {
        id: any;
        email: any;
        name: any;
        pictureUrl: any;
        credits: any;
        role: any;
        type: string;
        countryOfOrigin: any;
        username?: undefined;
    };
}
