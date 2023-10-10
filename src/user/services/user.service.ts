import { AuthService } from '@src/auth/services/auth.service';
import { CreateUserDto } from '@src/user/dtos/create-user.dto';
import { UserRepository } from '@src/user/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { CreateUserAuthDto } from '@src/auth/dtos/create-user-auth.dto';
import { PrismaService } from '@src/prisma/prisma.service';
import { PrismaTransaction } from '@src/common/interface/common-interface';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
    private readonly prismaServcie: PrismaService,
  ) {}

  async createUser(user: CreateUserDto) {
    return await this.prismaServcie.$transaction(
      async (transaction: PrismaTransaction) => {
        const createUser = await this.userRepository.createUser(
          transaction,
          user,
        );

        const auth: CreateUserAuthDto = {
          userId: createUser.id,
          authEmail: user.authEmail,
          signUpType: user.provider,
        };

        await this.authService.createUserAuth(transaction, auth);
      },
    );
  }
}
