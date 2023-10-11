import { CreateUserDto } from '@src/user/dtos/create-user.dto';
import { PrismaService } from '@src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { PrismaTransaction } from '@src/common/interface/common-interface';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async trxCreateUser(
    tx: PrismaTransaction,
    {
      regionId,
      name,
      nickname,
      email,
      isProfileOpen,
      phoneNumber,
      detailAddress,
      gender,
    }: CreateUserDto,
  ): Promise<any> {
    return await tx.users.create({
      data: {
        regionId,
        name,
        nickname,
        email,
        isProfileOpen,
        phoneNumber,
        detailAddress,
        gender,
      },
    });
  }
}
