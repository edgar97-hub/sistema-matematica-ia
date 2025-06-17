import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from '../auth/auth.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    // console.log('user', user);
    // Check if the user exists and is an admin user
    // return user && user.type === 'admin';
    // console.log('user && user.role ', user.role, 'ADMINISTRADOR');
    return user && user.role === 'ADMINISTRATOR';
  }
}
