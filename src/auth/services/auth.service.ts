import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateUserAuthDto } from '@src/auth/dtos/create-user-auth.dto';
import { Auth, Users } from '@prisma/client';
import { SignUpType } from '@src/common/config/sign-up-type.config';
import { AuthInputData } from '@src/auth/interface/interface';
import { PrismaTransaction } from '@src/common/interface/common-interface';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly prismaService: PrismaService) {}
  onModuleInit() {
    this.logger.log('AuthService Init');
  }

  async createUserAuth({
    userId,
    authEmail,
    signUpType,
  }: CreateUserAuthDto): Promise<void> {
    const mappedSignUpType: SignUpType = this.mapSignUpType(signUpType);
    await this.validateUserAuth(userId);

    const authData: AuthInputData = {
      userId,
      email: authEmail,
      signUpTypeId: mappedSignUpType,
    };

    await this.prismaService.auth.create({ data: authData });
  }

  async trxCreateUserAuth(
    tx: PrismaTransaction,
    { userId, authEmail, signUpType }: CreateUserAuthDto,
  ): Promise<any> {
    const mappedSignUpType: SignUpType = this.mapSignUpType(signUpType);
    await this.trxValidateUserAuth(tx, userId, authEmail);

    const authData: AuthInputData = {
      userId,
      email: authEmail,
      signUpTypeId: mappedSignUpType,
    };

    return await tx.auth.create({ data: authData });
  }

  private async validateUserAuth(userId: number): Promise<void> {
    try {
      const selectedUser: Users = await this.prismaService.users.findUnique({
        where: { id: userId },
      });

      if (!selectedUser) {
        throw new NotFoundException(
          '존재하지 않는 유저 데이터입니다.',
          'notFoundUserData',
        );
      }
      if (selectedUser.deletedAt) {
        throw new BadRequestException(
          '유효하지 않은 유저 정보 요청입니다.',
          'invalidUserInformation',
        );
      }

      const selectedUserAuth: Auth | null =
        await this.prismaService.auth.findUnique({
          where: { userId: selectedUser.id },
        });
      if (selectedUserAuth) {
        throw new BadRequestException(
          '이미 가입되어있는 유저입니다.',
          'alreadyExistUser',
        );
      }
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private async trxValidateUserAuth(
    tx: PrismaTransaction,
    userId: number,
    authEmail: string,
  ): Promise<void> {
    try {
      const selectedUser: Users = await tx.users.findUnique({
        where: { id: userId },
      });

      if (!selectedUser) {
        throw new NotFoundException(
          '존재하지 않는 유저 데이터입니다.',
          'notFoundUserData',
        );
      }
      if (selectedUser.deletedAt) {
        throw new BadRequestException(
          '유효하지 않은 유저 정보 요청입니다.',
          'invalidUserInformation',
        );
      }

      const selectedUserAuth: Auth | null = await tx.auth.findUnique({
        where: { userId: selectedUser.id },
      });
      if (selectedUserAuth) {
        throw new BadRequestException(
          '이미 가입되어있는 유저입니다.',
          'alreadyExistUser',
        );
      }

      const selectedEmailAuth: Auth | null = await tx.auth.findUnique({
        where: { email: authEmail },
      });
      if (selectedEmailAuth) {
        throw new BadRequestException('이미 가입된 이메일입니다.');
      }
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private mapSignUpType(signUpTypeString): SignUpType {
    let mappedSignUpType: SignUpType;

    switch (signUpTypeString) {
      case 'KAKAO':
        mappedSignUpType = SignUpType.KAKAO;
        break;
      case 'GOOGLE':
        mappedSignUpType = SignUpType.GOOGLE;
        break;
      case 'NAVER':
        mappedSignUpType = SignUpType.NAVER;
        break;
      default:
        throw new BadRequestException(
          '잘못된 SignUpType 입니다.',
          'invalidSignUpType',
        );
    }

    return mappedSignUpType;
  }
}
