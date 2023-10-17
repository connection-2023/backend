import { AuthService } from '@src/auth/services/auth.service';
import { CreateUserDto } from '@src/user/dtos/create-user.dto';
import { UserRepository } from '@src/user/repositories/user.repository';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserAuthDto } from '@src/auth/dtos/create-user-auth.dto';
import { PrismaService } from '@src/prisma/prisma.service';
import { PrismaTransaction } from '@src/common/interface/common-interface';
import { UserProfileImage, Users } from '@prisma/client';

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
        throw new BadRequestException('사용 중인 닉네임입니다.');
      }

      if (user.phoneNumber) {
        const selectedPhoneNumberUser =
          await this.prismaServcie.users.findUnique({
            where: { phoneNumber: user.phoneNumber },
          });
        if (selectedPhoneNumberUser) {
          throw new BadRequestException('사용 중인 번호입니다.');
        }
      }

      return await this.prismaServcie.$transaction(
        async (transaction: PrismaTransaction) => {
          const createUser = await this.userRepository.trxCreateUser(
            transaction,
            user,
          );
          const auth: CreateUserAuthDto = {
            userId: createUser.id,
            authEmail: user.authEmail,
            signUpType: user.provider,
          };
          const createAuth = await this.authService.trxCreateUserAuth(
            transaction,
            auth,
          );

          return { createUser, createAuth };
        },
      );
    } catch (error) {
      throw error;
    }
  }

  async createUserImage(
    userId: number,
    imageUrl: string,
  ): Promise<UserProfileImage> {
    return await this.prismaServcie.userProfileImage.create({
      data: { userId, imageUrl },
    });
  }

  async findByUserId(userId: number): Promise<UserProfileImage> {
    return await this.prismaServcie.userProfileImage.findUnique({
      where: { userId },
    });
  }

  async findByNickname(nickname: string) {
    const existNickname = await this.prismaServcie.users.findUnique({
      where: { nickname },
    });

    if (existNickname) {
      throw new HttpException('duplicated nickname', HttpStatus.FORBIDDEN);
    }
  }
}
