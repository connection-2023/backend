import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { DanceCategory } from '@src/common/enum/enum';

export class UpdateMyLecturerProfileDto {
  @ApiProperty({
    example: ['url', 'url'],
    description: `이미지 업로드 api에서 받아온 url배열`,
    required: false,
  })
  @IsArray()
  @IsOptional()
  newProfileImageUrls: string[];

  @ApiProperty({
    example: 'url',
    description: '프로필 카드 이미지',
    required: false,
  })
  @IsOptional()
  profileCardImageUrl: string;

  @ApiProperty({
    example: ['K-pop', '힙합'],
    description: `장르 배열`,
    required: false,
  })
  @IsArray()
  @IsEnum(DanceCategory, { each: true })
  @IsOptional()
  genres: DanceCategory[];

  @ApiProperty({
    example: ['기타일때 직접입력한 것들', '기타일때 직접입력한 것들'],
    description: '기타 장르',
    required: false,
  })
  @IsArray()
  @IsOptional()
  etcGenres: string[];

  @ApiProperty({
    example: ['서울특별시 도봉구', '서울특별시 전 지역', '온라인'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  regions: string[];

  @ApiProperty({
    example: 'https://www.youtube.com/',
    description: '유튜브 url',
    required: false,
  })
  @IsOptional()
  youtubeUrl: string;

  @ApiProperty({
    example: '인스타 주소',
    description: '인스타 url',
    required: false,
  })
  @IsOptional()
  instagramUrl: string;

  @ApiProperty({
    example: '홈페이지 주소',
    description: '홈페이지 url',
    required: false,
  })
  @IsOptional()
  homepageUrl: string;

  @ApiProperty({
    example: ['인스타 글 url', '인스타 글 url'],
    description: '그외 사이트',
    required: false,
  })
  @IsArray()
  @IsOptional()
  instagramPostUrls: string[];

  @ApiProperty({
    example: 'CJ ent',
    description: '소속 크루, 학원',
    required: false,
  })
  @IsOptional()
  affiliation: string;

  @ApiProperty({
    example: '안녕하세요 올리버쌤입니다.',
    description: '강사 소개',
    required: false,
  })
  @IsOptional()
  introduction: string;

  @ApiProperty({
    example: '태권도 3단, 눈치백단',
    description: '강사 경력',
    required: false,
  })
  @IsOptional()
  experience: string;
}
