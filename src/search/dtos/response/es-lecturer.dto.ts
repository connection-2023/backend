import { ApiProperty } from '@nestjs/swagger';
import { IEsLecturer } from '../../interface/search.interface';
import { EsRegionDto } from './es-region.dto';
import { EsGenreDto } from './es-genre.dto';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class EsLecturerDto {
  @ApiProperty({
    type: Number,
    isArray: true,
    description: '페이지네이션 타겟 배열',
  })
  @Expose()
  searchAfter: number[];

  @ApiProperty({
    type: Number,
    description: '강사 Id',
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: '닉네임',
  })
  @Expose()
  nickname: string;

  @ApiProperty({
    description: '프로필 이미지',
  })
  @Transform(({ obj }) => obj.profilecardimageurl)
  @Expose()
  profileCardImageUrl: string;

  @ApiProperty({
    description: '별점',
  })
  @Expose()
  stars: string;

  @ApiProperty({
    type: Number,
    description: '리뷰 수',
  })
  @Transform(({ obj }) => obj.reviewcount)
  @Expose()
  reviewCount: number;

  @ApiProperty({
    isArray: true,
    description: '소속',
  })
  @Expose()
  affiliation: string;

  @ApiProperty({
    type: Boolean,
    description: '좋아요 여부',
  })
  @Expose()
  isLiked: boolean;

  @ApiProperty({
    isArray: true,
    description: '강사 이미지',
  })
  @Expose()
  lecturerImages: string[];

  @ApiProperty({
    type: EsRegionDto,
    isArray: true,
    description: '지역',
  })
  @Transform(({ value }) =>
    value ? value.map((region) => new EsRegionDto(region)) : [],
  )
  @Expose()
  regions: EsRegionDto[];

  @ApiProperty({
    type: EsGenreDto,
    isArray: true,
    description: '장르',
  })
  @Transform(({ value }) =>
    value ? value.map((genre) => new EsGenreDto(genre)) : [],
  )
  @Expose()
  genres: EsGenreDto[];

  updatedat: Date;

  constructor(lecturer: Partial<IEsLecturer>) {
    Object.assign(this, lecturer);

    this.stars = lecturer.stars ? lecturer.stars.toFixed(1) : '0';

    this.isLiked = lecturer.isLiked ? true : false;
  }
}
