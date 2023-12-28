import { ApiProperty } from '@nestjs/swagger';
import { IESLecture } from '../interface/search.interface';
import { EsGenreDto } from './es-genre.dto';
import { EsRegionDto } from './es-region.dto';
import { EsSimpleLecturerDto } from './es-simple-lecturer.dto';

export class EsLectureDto {
  @ApiProperty({
    type: Number,
    isArray: true,
    description: '페이지네이션 타겟 배열',
  })
  searchAfter: number[];

  @ApiProperty({
    type: Number,
    description: '강의 Id',
  })
  id: number;

  @ApiProperty({
    description: '강의 제목',
  })
  title: string;

  @ApiProperty({
    type: Number,
    description: '가격',
  })
  price: number;

  @ApiProperty({
    description: '강의 사진',
    isArray: true,
  })
  lectureImages: string[];

  @ApiProperty({
    type: Date,
    description: '시작일',
  })
  startDate: Date;

  @ApiProperty({
    type: Date,
    description: '종료일',
  })
  endDate: Date;

  @ApiProperty({
    type: Boolean,
    description: '그룹 여부',
  })
  isGroup: boolean;

  @ApiProperty({
    description: '강의 형식',
  })
  lectureMethod: string;

  @ApiProperty({
    type: Number,
    description: '별점',
  })
  stars: number;

  @ApiProperty({
    type: Number,
    description: '리뷰 수',
  })
  reviewCount: number;

  @ApiProperty({
    description: '난이도',
  })
  difficultyLevel: string;

  @ApiProperty({
    type: Boolean,
    description: '좋아요 여부',
  })
  isLiked: boolean;

  updatedAt: Date;

  @ApiProperty({
    type: EsSimpleLecturerDto,
    description: '강사 정보',
  })
  lecturer: EsSimpleLecturerDto;

  @ApiProperty({
    type: EsRegionDto,
    isArray: true,
    description: '지역',
  })
  regions: EsRegionDto[];

  @ApiProperty({
    type: EsGenreDto,
    isArray: true,
    description: '장르',
  })
  genres: EsGenreDto[];

  constructor(lecture: Partial<IESLecture>) {
    this.searchAfter = lecture.searchAfter;
    this.id = lecture.id;
    this.title = lecture.title;
    this.price = lecture.price;
    this.lectureImages = lecture.lectureImages;
    this.startDate = lecture.startdate;
    this.endDate = lecture.enddate;
    this.isGroup = lecture.isgroup;
    this.lectureMethod = lecture.lecturemethod;
    this.stars = lecture.stars;
    this.reviewCount = lecture.reviewcount;
    this.isLiked = lecture.isLiked;

    this.lecturer = new EsSimpleLecturerDto(lecture.lecturer);

    this.regions = lecture.regions
      ? lecture.regions.map((region) => new EsRegionDto(region))
      : null;
    this.genres = lecture.genres
      ? lecture.genres.map((genre) => new EsGenreDto(genre))
      : null;

    Object.assign(this);
  }
}
