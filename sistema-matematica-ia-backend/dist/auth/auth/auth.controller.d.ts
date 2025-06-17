import { AuthService } from './auth.service';
import { LoginDto } from '../dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    googleAuthRedirect(req: any): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            name: string;
            profile_picture: string;
            credit_balance: number;
            role: import("../../users/enums/user-pwa-role.enum").UserPwaRole;
        };
    }>;
    getPwaProfile(req: any): {
        id: any;
        username: any;
        email: any;
        name: any;
        role: any;
        type: string;
        pictureUrl?: undefined;
        credits?: undefined;
    } | {
        id: any;
        email: any;
        name: any;
        pictureUrl: any;
        credits: any;
        role: any;
        type: string;
        username?: undefined;
    };
}
