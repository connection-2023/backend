import { LectureService } from './../services/lecture.service';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateLectureDto } from '../dtos/create-lecture.dto';

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
}
