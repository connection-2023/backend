import { Injectable } from '@nestjs/common';
import { Auth } from '@prisma/client';
import { SignUpType } from '@src/common/config/sign-up-type.config';
import { PrismaService } from '@src/prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserAuth(userEmail: string, signUpType: SignUpType): Promise<Auth> {
    const userAuth: Auth = await this.prismaService.auth.findFirst({
      where: { email: userEmail, deletedAt: null },
    });

    return userAuth;
  }
}
