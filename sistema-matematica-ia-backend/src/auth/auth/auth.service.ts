import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminUsersService } from '../../admin-users/admin-users/admin-users.service';
import { AdminUserEntity } from '../../admin-users/entities/admin-user.entity';
import { UsersService } from '../../users/users/users.service';
import { UserEntity } from '../../users/entities/user.entity';
import { SystemConfigurationService } from '../../system-configuration/services/system-configuration.service';
import { CreditService } from '../../credit-system/services/credit.service';

export interface JwtPayload {
  sub: number;
  username?: string;
  email?: string;
  role: string;
  type: 'admin' | 'pwa';
}

@Injectable()
export class AuthService {
  constructor(
    private adminUsersService: AdminUsersService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private systemConfigurationService: SystemConfigurationService,
    private creditService: CreditService,
  ) {}

  async validateAdmin(
    username: string,
    password: string,
  ): Promise<AdminUserEntity | null> {
    return this.adminUsersService.validateUser(username, password);
  }

  // async validateAdmin(
  //   username: string,
  //   pass: string,
  // ): Promise<AdminUserEntity | null> {
  //   console.log(`AuthService: Validating admin - ${username}`);
  //   const adminUser = await this.adminUsersService.findOneByUsername(username); // Necesitas este método en AdminUsersService
  //   if (adminUser && (await adminUser.comparePassword(pass))) {
  //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //     const { password, ...result } = adminUser; // Quita la contraseña del objeto devuelto
  //     return result as AdminUserEntity;
  //   }
  //   return null;
  // }

  async loginAdmin(user: AdminUserEntity) {
    console.log('user', user);
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      type: 'admin',
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async findOrCreatePwaUser(profile: any): Promise<UserEntity> {
    const user = await this.usersService.findOrCreateFromGoogle(profile);

    if (user.googleId && user.credit_balance === 0) {
      const config = await this.systemConfigurationService.getConfiguration();
      if (config.welcomeCreditEnabled) {
        await this.creditService.addWelcomeCredits(
          user.id,
          config.welcomeCreditAmount,
        );
        // Refresh the user to get the updated credit balance
        const updatedUser = await this.usersService.findById(user.id);
        if (updatedUser) {
          return updatedUser;
        } else {
          throw new NotFoundException(
            `User with ID "${user.id}" not found after adding welcome credits`,
          );
        }
      }
    }

    return user;
  }

  async loginPwaUser(user: UserEntity) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: 'pwa',
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profile_picture: user.pictureUrl,
        credit_balance: user.credit_balance,
        role: user.role,
      },
    };
  }

  async validateJwtPayload(
    payload: JwtPayload,
  ): Promise<AdminUserEntity | UserEntity | null> {
    if (payload.type === 'admin') {
      return this.adminUsersService.findById(payload.sub);
    } else if (payload.type === 'pwa') {
      return this.usersService.findById(payload.sub);
    }
    return null;
  }
}
