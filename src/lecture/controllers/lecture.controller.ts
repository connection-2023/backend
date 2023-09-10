import { LectureService } from './../services/lecture.service';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateLectureDto } from '../dtos/create-lecture.dto';
import { ReadManyLectureQueryDto } from '../dtos/read-many-lecture-query.dto';

@ApiTags('강의')
@Controller('lectures')
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  @ApiOperation({
    summary: '강의 생성',
  })
  @Post()
  async createLecture(@Body() lecture: CreateLectureDto) {
    const danceLecturerId = 1;
    return await this.lectureService.createLecture(lecture, danceLecturerId);
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
}
