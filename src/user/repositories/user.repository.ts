import { CreateUserDto } from '@src/user/dtos/create-user.dto';
import { PrismaService } from '@src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { PrismaTransaction } from '@src/common/interface/common-interface';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(
    transaction: PrismaTransaction,
    {
      regionId,
      name,
      nickname,
      isProfileOpen,
      phoneNumber,
      detailAddress,
      gender,
    }: CreateUserDto,
  ): Promise<any> {
    return await this.prismaService.users.create({
      data: {
        regionId,
        name,
        nickname,
        isProfileOpen,
        phoneNumber,
        detailAddress,
        gender,
      },
    });
  }
}
