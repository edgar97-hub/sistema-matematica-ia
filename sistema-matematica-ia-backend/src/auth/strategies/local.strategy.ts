import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AdminUserEntity } from '../../admin-users/entities/admin-user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  // constructor(private authService: AuthService) {
  //   // super();
  // }
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username', // Nombre del campo para el usuario en el request body (de LoginDto)
      passwordField: 'password', // Nombre del campo para la contraseña en el request body
    });
  }
  async validate(username: string, password: string): Promise<AdminUserEntity> {
    const user = await this.authService.validateAdmin(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
