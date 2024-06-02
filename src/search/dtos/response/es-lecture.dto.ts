import { ApiProperty } from '@nestjs/swagger';
import { IEsLecture } from '../../interface/search.interface';
import { EsGenreDto } from './es-genre.dto';
import { EsRegionDto } from './es-region.dto';
import { EsSimpleLecturerDto } from './es-simple-lecturer.dto';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { ToFixedStars } from '@src/common/validator/format-stars-as-single-decimal.validator';

@Exclude()
export class EsLectureDto {
  @ApiProperty({
    type: Number,
    isArray: true,
    description: '페이지네이션 타겟 배열',
  })
  @Expose()
  searchAfter: number[];

  @ApiProperty({
    type: Number,
    description: '강의 Id',
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: '강의 제목',
  })
  @Expose()
  title: string;

  @ApiProperty({
    type: Number,
    description: '가격',
  })
  @Expose()
  price: number;

  @ApiProperty({
    description: '강의 사진',
    isArray: true,
  })
  @Expose()
  lectureImages: string[];

  @ApiProperty({
    type: Date,
    description: '시작일',
  })
  @Expose()
  @Transform(({ obj }) => obj.startdate, { toClassOnly: true })
  startDate: Date;

  @ApiProperty({
    type: Date,
    description: '종료일',
  })
  @Expose()
  @Transform(({ obj }) => obj.enddate, { toClassOnly: true })
  endDate: Date;

  @ApiProperty({
    type: Boolean,
    description: '그룹 여부',
  })
  @Expose()
  @Transform(({ obj }) => obj.isgroup, { toClassOnly: true })
  isGroup: boolean;

  @ApiProperty({
    description: '강의 형식',
  })
  @Expose()
  @Transform(({ obj }) => obj.lecturemethod, { toClassOnly: true })
  lectureMethod: string;

  @ApiProperty({
    description: '별점',
  })
  @ToFixedStars()
  @Expose()
  stars: string;

  @ApiProperty({
    type: Number,
    description: '리뷰 수',
  })
  @Expose()
  @Transform(({ obj }) => obj.reviewcount, { toClassOnly: true })
  reviewCount: number;

  @ApiProperty({
    description: '난이도',
  })
  @Expose()
  difficultyLevel: string;

  @ApiProperty({
    type: Boolean,
    description: '좋아요 여부',
  })
  @Expose()
  isLiked: boolean;

  @ApiProperty({
    type: Boolean,
    description: '활성화 여부',
  })
  @Expose()
  @Transform(({ obj }) => obj.isactive, { toClassOnly: true })
  isActive: boolean;

  updatedAt: Date;

  @ApiProperty({
    type: EsSimpleLecturerDto,
    description: '강사 정보',
  })
  @Expose()
  @Type(() => EsSimpleLecturerDto)
  lecturer: EsSimpleLecturerDto;

  @ApiProperty({
    type: EsRegionDto,
    isArray: true,
    description: '지역',
  })
  @Expose()
  @Type(() => EsRegionDto)
  regions: EsRegionDto[];

  @ApiProperty({
    type: EsGenreDto,
    isArray: true,
    description: '장르',
  })
  @Expose()
  @Type(() => EsGenreDto)
  genres: EsGenreDto[];
}
