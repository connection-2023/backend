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
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LectureService } from '@src/lecture/services/lecture.service';
import { CreateLectureDto } from '@src/lecture/dtos/create-lecture.dto';
import { ReadManyLectureQueryDto } from '@src/lecture/dtos/read-many-lecture-query.dto';
import { UpdateLectureDto } from '@src/lecture/dtos/update-lecture.dto';
import { UploadsService } from '@src/uploads/uploads.service';

@ApiTags('강의')
@Controller('lectures')
export class LectureController {
  constructor(
    private readonly lectureService: LectureService,
    private readonly uploadsService: UploadsService,
  ) {}

  @ApiOperation({
    summary: '강의 생성',
  })
  @Post()
  @UseInterceptors(FilesInterceptor('files', 5))
  async createLecture(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() lecture: CreateLectureDto,
  ) {
    const danceLecturerId = 1;
    const imgurl: string[] = [];

    await Promise.all(
      files.map(async (file: Express.Multer.File) => {
        const url = await this.uploadsService.uploadFileToS3('lectures', file);
        imgurl.push(url);
      }),
    );

    return await this.lectureService.createLecture(
      lecture,
      danceLecturerId,
      imgurl,
    );
  }

  @ApiOperation({
    summary: '강의 전부 조회',
  })
  @Get()
  readManyLecture(@Query() query: ReadManyLectureQueryDto) {
    return this.lectureService.readManyLecture(query);
  }

  @ApiOperation({
    summary: '강의 단일 조회',
  })
  @Get('/:id')
  readOneLecture(@Param('id', ParseIntPipe) lectureId: number) {
    return this.lectureService.readOneLecture(lectureId);
  }

  @ApiOperation({ summary: '강의 수정' })
  @Patch('/:id')
  updateLecture(
    @Param('id', ParseIntPipe) lectureId: number,
    @Body() lecture: UpdateLectureDto,
  ) {
    return this.lectureService.updateLecture(lecture, lectureId);
  }

  @ApiOperation({ summary: '강의 삭제' })
  @Delete('/:id')
  deleteLecture(@Param('id', ParseIntPipe) lectureId: number) {
    return this.lectureService.deleteLecture(lectureId);
  }
}
