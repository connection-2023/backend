import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';

@Injectable()
export class AdminRepository {
  constructor(private readonly prismaService: PrismaService) {}
}
