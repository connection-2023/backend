import { LectureLikeService } from '@src/lecture/services/lecture-like.service';
import { Controller, Delete, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('강의 좋아요')
@Controller('lectures/:id/likes')
export class LectureLikeController {
  constructor(private readonly lectureLikeService: LectureLikeService) {}

  @ApiOperation({ summary: '강의 좋아요 생성' })
  @Post()
  async createLectureLike(@Param('id', ParseIntPipe) lectureId: number) {
    const userId = 1;
    return await this.lectureLikeService.createLikeLecture(lectureId, userId);
  }

  @ApiOperation({ summary: '강의 좋아요 삭제' })
  @Delete()
  async deleteLectureLike(@Param('id', ParseIntPipe) lectureId: number) {
    const userId = 1;
    return await this.lectureLikeService.deleteLikeLecture(lectureId, userId);
  }
}
