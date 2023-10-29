import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LectureService } from '@src/lecture/services/lecture.service';
import { CreateLectureDto } from '@src/lecture/dtos/create-lecture.dto';
import { UploadsService } from '@src/uploads/services/uploads.service';
import { Lecture, Lecturer, Users } from '@prisma/client';
import { ApiCreateLecture } from '../swagger-decorators/create-lecture-decorator';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { LecturerAccessTokenGuard } from '@src/common/guards/lecturer-access-token.guard';
import { ValidateResult } from '@src/common/interface/common-interface';
import { ApiReadOneLecture } from '../swagger-decorators/read-one-lecture-decorator';

@ApiTags('강의')
@Controller('lectures')
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  @ApiCreateLecture()
  @Post()
  @UseGuards(LecturerAccessTokenGuard)
  async createLecture(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Body() lecture: CreateLectureDto,
  ) {
    return await this.lectureService.createLecture(
      lecture,
      authorizedData.lecturer.id,
    );
  }

  @ApiReadOneLecture()
  @Get(':lectureId')
  async readLecture(@Param('lectureId', ParseIntPipe) lectureId: number) {
    const lecture = await this.lectureService.readLecture(lectureId);

    return { lecture };
  }

  // @Patch(':lectureId')
  // @UseInterceptors(FilesInterceptor('files', 5))
  // @UseGuards(UserAccessTokenGuard)
  // async updateLecture(
  //   @GetAuthorizedUser() user: Users,
  //   @UploadedFiles() files: Express.Multer.File[],
  //   @Body() lecture: UpdateLectureDto,
  // ) {}
}
