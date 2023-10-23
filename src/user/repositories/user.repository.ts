import { CreateUserDto } from '@src/user/dtos/create-user.dto';
import { PrismaService } from '@src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { PrismaTransaction } from '@src/common/interface/common-interface';
import { UserProfileImage, Users } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async trxCreateUser(
    transaction: PrismaTransaction,
    {
      name,
      nickname,
      email,
      isProfileOpen,
      phoneNumber,
      gender,
    }: CreateUserDto,
  ): Promise<Users> {
    return await transaction.users.create({
      data: {
        name,
        nickname,
        email,
        isProfileOpen,
        phoneNumber,
        gender,
      },
    });
  }

  async trxCreateUserImage(
    transaction: PrismaTransaction,
    userId: number,
    imageUrl: string,
  ): Promise<UserProfileImage> {
    return await transaction.userProfileImage.create({
      data: { userId, imageUrl },
    });
  }

  async getMyProfile(userId: number): Promise<Users> {
    return await this.prismaService.users.findUnique({
      where: { id: userId },
      include: {
        auth: { select: { email: true, signUpType: true } },
        userProfileImage: { select: { imageUrl: true } },
      },
    });
  }
}
