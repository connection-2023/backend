import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LecturerService } from '@src/lecturer/services/lecturer.service';
import { CreateLecturerDto } from '@src/lecturer/dtos/create-lecturer.dto';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { Users } from '@prisma/client';
import { UserAccessTokenGuard } from '@src/common/guards/user-access-token.guard';
import { ApiCreateLecturer } from '@src/lecturer/swagger-decorators/create-lecturer-decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('강사')
@Controller('lecturer')
export class LecturerController {
  constructor(private readonly lecturerService: LecturerService) {}

  @ApiCreateLecturer()
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
