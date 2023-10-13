import { AuthService } from '@src/auth/services/auth.service';
import { CreateUserDto } from '@src/user/dtos/create-user.dto';
import { UserRepository } from '@src/user/repositories/user.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
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
    try {
      const selectedEmailUser = await this.prismaServcie.users.findUnique({
        where: { email: user.email },
      });
      if (selectedEmailUser) {
        throw new BadRequestException('사용 중인 이메일입니다.');
      }

      const selectedNicknameUser = await this.prismaServcie.users.findUnique({
        where: { nickname: user.nickname },
      });
      if (selectedNicknameUser) {
        throw new BadRequestException('사용 중인 닉네임 입니다.');
      }

      const selectedPhoneNumberUser = await this.prismaServcie.users.findUnique(
        {
          where: { phoneNumber: user.phoneNumber },
        },
      );
      if (selectedPhoneNumberUser) {
        throw new BadRequestException('사용 중인 번호입니다.');
      }

      return await this.prismaServcie.$transaction(
        async (tx: PrismaTransaction) => {
          const createUser = await this.userRepository.trxCreateUser(tx, user);
          const auth: CreateUserAuthDto = {
            userId: createUser.id,
            authEmail: user.authEmail,
            signUpType: user.provider,
          };
          const createAuth = await this.authService.trxCreateUserAuth(tx, auth);

          return { createUser, createAuth };
        },
      );
    } catch (error) {
      throw error;
    }
  }
}
