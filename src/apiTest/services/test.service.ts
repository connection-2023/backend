import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';

@Injectable()
export class TestService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllUsers() {
    return await this.prismaService.users.findMany();
  }

  async deleteUser(userId: number) {
    return await this.prismaService.users.delete({ where: { id: userId } });
  }

  async getAllLecturer() {
    return await this.prismaService.lecturer.findMany();
  }

  async deleteLecturer(lecturerId: number) {
    return await this.prismaService.lecturer.delete({
      where: { id: lecturerId },
    });
  }
}
