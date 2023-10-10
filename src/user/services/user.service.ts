import { AuthService } from './../../auth/services/auth.service';
import { CreateUserDto } from '@src/user/dtos/create-user.dto';
import { UserRepository } from '@src/user/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { CreateUserAuthDto } from '@src/auth/dtos/create-user-auth.dto';
import { PrismaService } from '@src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
    private readonly prismaServcie: PrismaService,
  ) {}

  async createUser(user: CreateUserDto) {
    const createUserQuery = await this.userRepository.createUser(user);

    const auth: CreateUserAuthDto = {
      userId: createUserQuery.id,
      authEmail: user.authEmail,
      signUpType: user.provider,
    };

    const createAuthQuery = await this.authService.createUserAuth(auth);

    const newUser = await this.prismaServcie.$transaction(
      this.userRepository.createUser(user),
    );

    return newUser;
  }
}
