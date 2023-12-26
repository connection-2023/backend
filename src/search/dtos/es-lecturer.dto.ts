import { ApiProperty } from '@nestjs/swagger';
import { EsLecturer } from '../interface/search.interface';
import { EsRegionDto } from './es-region.dto';
import { EsGenreDto } from './es-genre.dto';

export class EsLecturerDto {
  @ApiProperty({
    type: Number,
    isArray: true,
    description: '페이지네이션 타겟 배열',
  })
  searchAfter: number[];

  @ApiProperty({
    type: Number,
    description: '강사 Id',
  })
  id: number;

  @ApiProperty({
    description: '닉네임',
  })
  nickname: string;

  @ApiProperty({
    description: '프로필 이미지',
  })
  profileCardImageUrl: string;

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
    type: Boolean,
    description: '좋아요 여부',
  })
  isLiked: boolean;

  @ApiProperty({
    isArray: true,
    description: '강사 이미지',
  })
  lecturerImages: string[];

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

  affiliation: string;
  updatedat: Date;

  constructor(lecturer: Partial<EsLecturer>) {
    this.searchAfter = lecturer.searchAfter;
    this.id = lecturer.id;
    this.nickname = lecturer.nickname;
    this.profileCardImageUrl = lecturer.profilecardimageurl;
    this.stars = lecturer.stars;
    this.reviewCount = lecturer.reviewcount;
    this.isLiked = lecturer.isLiked;
    this.lecturerImages = lecturer.lecturerImages;

    this.regions = lecturer.regions
      ? lecturer.regions.map((region) => new EsRegionDto(region))
      : null;
    this.genres = lecturer.genres
      ? lecturer.genres.map((genre) => new EsGenreDto(genre))
      : null;

    Object.assign(this);
  }
}
