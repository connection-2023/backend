import { UpdateUserDto } from './../dtos/update-user.dto';
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
import { Id, PrismaTransaction } from '@src/common/interface/common-interface';
import { UserProfileImage, Users } from '@prisma/client';
import {
  RegisterConsentInputData,
  RegisterConsents,
} from '../interface/user.interface';

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

      const { registerConsents } = user;

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
          const registerConsentInputData =
            await this.createRegisterConsentInputData(
              createUser.id,
              registerConsents,
            );

          const createRegisterConsent =
            await this.userRepository.trxCreateRegisterConsentAgreement(
              transaction,
              registerConsentInputData,
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

  async getMyProfile(userId: number) {
    return await this.userRepository.getMyProfile(userId);
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    const { provider, authEmail, imageUrl, ...updateUserSetData } =
      updateUserDto;

    if (updateUserDto.email) {
      const selectedEmailUser = await this.prismaServcie.users.findUnique({
        where: { email: updateUserDto.email },
      });
      if (selectedEmailUser) {
        throw new BadRequestException('사용 중인 이메일입니다.');
      }
    }
    if (updateUserDto.nickname) {
      const selectedNicknameUser = await this.prismaServcie.users.findUnique({
        where: { nickname: updateUserDto.nickname },
      });
      if (selectedNicknameUser) {
        throw new BadRequestException('사용 중인 닉네임입니다.');
      }
    }

    if (updateUserDto.phoneNumber) {
      const selectedPhoneNumberUser = await this.prismaServcie.users.findUnique(
        {
          where: { phoneNumber: updateUserDto.phoneNumber },
        },
      );
      if (selectedPhoneNumberUser) {
        throw new BadRequestException('사용 중인 번호입니다.');
      }
    }

    if (imageUrl) {
      await this.userRepository.updateUserImage(userId, imageUrl);
    }

    if (updateUserSetData) {
      await this.userRepository.updateUser(userId, updateUserSetData);
    }
  }

  private async getRegisterConsentIds(
    registerConsents: RegisterConsents,
  ): Promise<Id[]> {
    const agreeConsentList = [];
    for (const consent in registerConsents) {
      if (consent === 'marketing') {
        for (const marketing in registerConsents[consent]) {
          if (registerConsents[consent][marketing]) {
            agreeConsentList.push({ name: marketing });
          }
        }
      } else if (registerConsents[consent]) {
        agreeConsentList.push({ name: consent });
      }
    }
    return await this.userRepository.getRegisterConsentId(agreeConsentList);
  }

  private async createRegisterConsentInputData(
    userId: number,
    registerConcents: RegisterConsents,
  ): Promise<RegisterConsentInputData[]> {
    const registerConsentIds = await this.getRegisterConsentIds(
      registerConcents,
    );
    const registerConsentInputData: RegisterConsentInputData[] =
      registerConsentIds.map((consentId) => ({
        userId,
        registerConsentId: consentId.id,
      }));

    return registerConsentInputData;
  }
}
