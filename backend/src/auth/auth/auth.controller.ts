import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LoginDto } from '../dto/login.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  // Admin Authentication Endpoints
  @UseGuards(LocalAuthGuard)
  @Post('admin/login')
  async loginAdmin(@Request() req, @Body() loginDto: LoginDto) {
    return this.authService.loginAdmin(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/profile')
  getAdminProfile(@Request() req) {
    return {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
    };
  }

  // Google OAuth Endpoints for PWA Users
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Request() req) {
    // This method initiates the Google OAuth flow
    // Passport will handle the redirect to Google
  }

  // @Get('google/redirect')
  // @UseGuards(AuthGuard('google'))
  // async googleAuthRedirect(@Request() req) {
  //   // This method handles the callback from Google
  //   // req.user contains the PWA user created/found by GoogleStrategy
  //   return this.authService.loginPwaUser(req.user);
  // }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google')) // GoogleStrategy se encarga de findOrCreatePwaUser
  async googleAuthRedirect(@Request() req, @Res() res: Response) {
    // Inyecta @Res()
    if (!req.user) {
      // Esto no debería pasar si GoogleStrategy funcionó, pero es una guarda
      const frontendLoginUrl =
        this.configService.get<string>('FRONTEND_URL') ||
        'http://localhost:3001';
      return res.redirect(
        `${frontendLoginUrl}/login?error=${encodeURIComponent('Fallo en la autenticación con Google')}`,
      );
    }

    // req.user aquí es UserEntity (o el objeto que devuelve tu GoogleStrategy.validate -> authService.findOrCreatePwaUser)
    const pwaUser = req.user as UserEntity; // Asegúrate del tipo
    const loginResult = await this.authService.loginPwaUser(pwaUser); // Genera el JWT

    const frontendCallbackUrl = `${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3001'}/auth/google/callback`;

    if (loginResult.access_token) {
      res.redirect(`${frontendCallbackUrl}?token=${loginResult.access_token}`);
    } else {
      const frontendLoginUrl = this.configService.get<string>('FRONTEND_URL');
      res.redirect(
        `${frontendLoginUrl}/login?error=${encodeURIComponent('Error al generar sesión')}`,
      );
    }
  }

  // PWA User Profile Endpoint
  @UseGuards(JwtAuthGuard)
  @Get('pwa/profile')
  getPwaProfile(@Request() req) {
    // This endpoint works for both admin and PWA users
    // We can differentiate by checking the user properties
    if ('username' in req.user) {
      // Admin user
      return {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        type: 'admin',
      };
    } else {
      // PWA user
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
  // @UseGuards(JwtAuthGuard) // Asegura que el token sea válido
  // @Get('pwa/profile')
  // async getPwaUserProfile(@Request() req) {
  //   const jwtPayload = req.user as JwtPayload; // Payload decodificado por JwtStrategy
  //   console.log(
  //     'AuthController: getPwaUserProfile called with JWT payload:',
  //     jwtPayload,
  //   );

  //   if (jwtPayload.type !== 'pwa' || !jwtPayload.sub) {
  //     throw new UnauthorizedException(
  //       'Invalid token type or missing user ID for PWA profile.',
  //     );
  //   }
  //   // JwtStrategy podría ya devolver la entidad UserEntity completa si la busca en su validate().
  //   // Si JwtStrategy solo devuelve el payload, necesitas buscar al usuario aquí.
  //   // Asumamos que JwtStrategy devuelve el payload y necesitamos buscar el usuario.
  //   const user = await this.authService.getPwaUserByIdForProfile(
  //     jwtPayload.sub,
  //   ); // Nuevo método en AuthService
  //   if (!user) {
  //     throw new NotFoundException('PWA user not found for token.');
  //   }
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   const { password, ...userProfile } = user; // Asegurar que no se devuelva la contraseña si UserEntity la tuviera
  //   return userProfile;
  // }
}
