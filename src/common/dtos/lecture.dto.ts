import { Lecture, LectureMethod } from '@prisma/client';
import { BaseReturnDto } from './base-return.dto';
import { ApiProperty } from '@nestjs/swagger';
import { LecturerDto } from './lecturer.dto';
import { LectureTypeDto } from './lecture-type.dto';
import { LectureImageDto } from './lecture-image.dto';
import { LectureToRegionDto } from './lecture-to-region.dto';
import { LectureToDanceGenreDto } from './lecture-to-dance-genre.dto';
import { LectureMethodDto } from './lecture-method.dto';
import { LikedLectureDto } from './liked-lecture.dto';
import { ILecture } from '@src/lecture/interface/lecture.interface';

export class LectureDto extends BaseReturnDto {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({ description: '제목' })
  title: string;

  @ApiProperty({ description: '시작 일', type: Date })
  startDate: Date;

  @ApiProperty({ description: '마감 일', type: Date })
  endDate: Date;

  @ApiProperty({ description: '모집 여부', type: Boolean })
  isActive: boolean;

  @ApiProperty({ description: '가격', type: Number })
  price: number;

  @ApiProperty({ description: '평점' })
  stars: string;

  @ApiProperty({ description: '리뷰 수', type: Number })
  reviewCount: number;

  @ApiProperty({ description: '그룹 여부', type: Boolean })
  isGroup: boolean;

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

  @ApiProperty({ description: '원데이 정기', type: LectureMethodDto })
  lectureMethod: LectureMethodDto;

  @ApiProperty({ description: '강사', type: LecturerDto })
  lecturer?: LecturerDto;

  @ApiProperty({
    description: '강의 이미지',
    type: LectureImageDto,
  })
  lectureImage?: LectureImageDto[];

  @ApiProperty({ description: '좋아요 여부', type: LikedLectureDto })
  likedLecture?: LikedLectureDto[];

  lecturerId: number;
  lectureTypeId: number;
  lectureMethodId: number;
  introduction: string;
  curriculum: string;
  duration: number;
  difficultyLevel: string;
  minCapacity: number;
  maxCapacity: number;
  reservationDeadline: number;
  reservationComment: string;
  noShowDeposit: number;
  locationDescription: string;
  deletedAt: Date;

  lectureType: LectureTypeDto;

  constructor(lecture: Partial<ILecture>) {
    super();

    this.id = lecture.id;
    this.title = lecture.title;
    this.lectureImage = lecture.lectureImage;
    this.startDate = lecture.startDate;
    this.endDate = lecture.endDate;
    this.isActive = lecture.isActive;
    this.price = lecture.price;
    this.stars = lecture.stars.toFixed(1);
    this.reviewCount = lecture.reviewCount;
    this.isGroup = lecture.isGroup;

    this.lectureToDanceGenre = lecture.lectureToDanceGenre
      ? lecture.lectureToDanceGenre.map(
          (dance) => new LectureToDanceGenreDto(dance),
        )
      : null;

    this.lectureToRegion = lecture.lectureToRegion
      ? lecture.lectureToRegion.map((region) => new LectureToRegionDto(region))
      : null;

    this.lectureMethod = lecture.lectureMethod
      ? new LectureMethodDto(lecture.lectureMethod)
      : undefined;

    this.likedLecture = lecture.likedLecture
      ? lecture.likedLecture.map((like) => new LikedLectureDto(like))
      : undefined;

    this.lecturer = lecture.lecturer
      ? new LecturerDto(lecture.lecturer)
      : undefined;

    this.lectureImage = lecture.lectureImage
      ? lecture.lectureImage.map((url) => new LectureImageDto(url))
      : null;

    Object.seal(this);
  }
}
