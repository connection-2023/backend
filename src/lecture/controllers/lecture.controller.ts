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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LectureService } from '@src/lecture/services/lecture.service';
import { CreateLectureDto } from '@src/lecture/dtos/create-lecture.dto';
import { UploadsService } from '@src/uploads/services/uploads.service';
import { Lecture, Lecturer, Users } from '@prisma/client';
import { ApiCreateLecture } from '../swagger-decorators/create-lecture-decorator';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { LecturerAccessTokenGuard } from '@src/common/guards/lecturer-access-token.guard';
import { ValidateResult } from '@src/common/interface/common-interface';
import { ApiReadOneLecture } from '../swagger-decorators/read-one-lecture-decorator';
import { ReadManyLectureQueryDto } from '../dtos/read-many-lecture-query.dto';

@ApiTags('강의')
@Controller('lectures')
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  @ApiCreateLecture()
  @UseGuards(LecturerAccessTokenGuard)
  @Post()
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

  @ApiOperation({ summary: '강의 모두 보기' })
  @Get()
  async readManyLecture(@Query() query: ReadManyLectureQueryDto) {
    const lectures = await this.lectureService.readManyLecture(query);

    return { lectures };
  }

  @ApiOperation({ summary: '강의 삭제' })
  @ApiBearerAuth()
  @UseGuards(LecturerAccessTokenGuard)
  @Delete(':lectureId')
  async deleteLecture(@Param('lectureId', ParseIntPipe) lectureId: number) {
    const deletedLecture = await this.lectureService.deleteLecture(lectureId);

    return { lecture: deletedLecture };
  }

  @ApiOperation({ summary: '강의 수정' })
  @ApiBearerAuth()
  @UseGuards(LecturerAccessTokenGuard)
  @Patch(':lectureId')
  async updateLecture(
    @GetAuthorizedUser() authroizedData: ValidateResult,
    @Param('lectureId', ParseIntPipe) lectureId: number,
    @Body() updateLectureDto: UpdateLectureDto,
  ) {
    const updatedLecture = await this.lectureService.updateLecture(
      lectureId,
      updateLectureDto,
    );
  }
}
