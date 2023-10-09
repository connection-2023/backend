import { CreateUserDto } from '@src/user/dtos/create-user.dto';
import { PrismaService } from '@src/prisma/prisma.service';
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser({
    regionId,
    name,
    nickname,
    isProfileOpen,
    phoneNumber,
    detailAddress,
    gender,
  }: CreateUserDto): Promise<any> {
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
