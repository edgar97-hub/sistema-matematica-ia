import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LoginDto } from '../dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Request() req) {
    // This method handles the callback from Google
    // req.user contains the PWA user created/found by GoogleStrategy
    return this.authService.loginPwaUser(req.user);
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
        credits: req.user.credits,
        role: req.user.role,
        type: 'pwa',
      };
    }
  }
}
