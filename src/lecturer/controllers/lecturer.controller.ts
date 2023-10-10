import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { LecturerService } from '../services/lecturer.service';
import { CreateLecturerDto } from '../dtos/create-lecturer.dto';
import { LecturerAccessTokenGuard } from '@src/common/guards/lecturer-access-token.guard';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { Lecturer, Users } from '@prisma/client';
import { UserAccessTokenGuard } from '@src/common/guards/user-access-token.guard';

@Controller('lecturer')
export class LecturerController {
  constructor(private readonly lecturerService: LecturerService) {}

  @Post()
  @UseGuards(UserAccessTokenGuard)
  async createLecturer(
    @GetAuthorizedUser() user: Users,
    @Body() createLecturerDto: CreateLecturerDto,
  ) {
    await this.lecturerService.createLecturer(user.id, createLecturerDto);

    return { message: '강사 생성 완료' };
  }
}
