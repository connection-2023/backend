import { ApiProperty } from '@nestjs/swagger';
import { LikedLecture } from '@prisma/client';
import { LectureDto } from './lecture.dto';
import { UserDto } from './user.dto';

export class LikedLectureDto implements LikedLecture {
  @ApiProperty({ description: '좋아요 id', type: Number })
  id: number;

  lectureId: number;
  userId: number;

  lecture: LectureDto;
  user: UserDto;

  constructor(likedLecture: Partial<LikedLectureDto>) {
    this.id = likedLecture.id;

    Object.seal(this);
  }
}
