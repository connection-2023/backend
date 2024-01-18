import { BaseReturnDto } from '@src/common/dtos/base-return.dto';
import { ApiProperty } from '@nestjs/swagger';
import { LectureToDanceGenreDto } from '@src/common/dtos/lecture-to-dance-genre.dto';
import { LectureToRegionDto } from '@src/common/dtos/lecture-to-region.dto';
import { ILecture } from '../interface/lecture.interface';
import { LectureImageDto } from '@src/common/dtos/lecture-image.dto';

export class LecturePreviewDto extends BaseReturnDto {
  @ApiProperty({ description: '강의 id', type: Number })
  id: number;

  @ApiProperty({ description: '강의 제목' })
  title: string;

  @ApiProperty({ description: '평점' })
  stars: string;

  @ApiProperty({
    description: '지역',
    type: LectureToRegionDto,
    isArray: true,
    nullable: true,
  })
  lectureToRegion?: LectureToRegionDto[];

  @ApiProperty({
    description: '장르',
    type: LectureToDanceGenreDto,
    isArray: true,
    nullable: true,
  })
  lectureToDanceGenre?: LectureToDanceGenreDto[];

  @ApiProperty({ description: '그룹 여부', type: Boolean })
  isGroup: boolean;

  @ApiProperty({ description: '최대 인원', type: Number })
  maxCapacity: number;

  @ApiProperty({ description: '수업 진행 시간', type: Number })
  duration: number;

  @ApiProperty({ description: '난이도' })
  difficultyLevel: string;

  @ApiProperty({
    description: '강의 이미지',
    type: LectureImageDto,
  })
  lectureImage?: LectureImageDto[];

  @ApiProperty({ description: '좋아요 여부', type: Boolean })
  isLike?: boolean;

  constructor(lecture: Partial<ILecture>) {
    super();

    this.id = lecture.id;
    this.title = lecture.title;
    this.lectureImage = lecture.lectureImage;
    this.stars = lecture.stars.toFixed(1);
    this.isGroup = lecture.isGroup;
    this.difficultyLevel = lecture.difficultyLevel;
    this.maxCapacity = lecture.maxCapacity;
    this.duration = lecture.duration;

    this.lectureToRegion = lecture.lectureToRegion
      ? lecture.lectureToRegion.map((region) => new LectureToRegionDto(region))
      : null;

    this.isLike = lecture.likedLecture
      ? lecture.likedLecture[0]
        ? true
        : false
      : false;

    this.lectureImage = lecture.lectureImage
      ? lecture.lectureImage.map((url) => new LectureImageDto(url))
      : null;

    this.lectureToDanceGenre = lecture.lectureToDanceGenre
      ? lecture.lectureToDanceGenre.map(
          (dance) => new LectureToDanceGenreDto(dance),
        )
      : null;
  }
}
