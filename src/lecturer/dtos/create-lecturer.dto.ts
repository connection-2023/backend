import { ApiProperty } from '@nestjs/swagger';
import { DanceCategory } from '@src/common/enum/enum';
import { IsArray, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLecturerDto {
  @ApiProperty({
    example: '올리버쌤',
    description: '닉네임 중복 확인 후 진행',
    required: true,
  })
  @IsNotEmpty()
  nickname: string;

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
    example: 'CJ ent',
    description: '소속 크루, 학원',
    required: false,
  })
  @IsOptional()
  affiliation: string;

  @ApiProperty({
    description: '강사 소개',
    required: true,
  })
  @IsNotEmpty()
  introduction: string;

  @ApiProperty({
    description: '강사 경력',
    required: true,
  })
  @IsNotEmpty()
  experience: string;

  @ApiProperty({
    example: ['서울특별시 도봉구', '서울특별시 중구'],
    description: '강사 강의 지역',
    required: true,
  })
  @IsArray()
  @IsNotEmpty()
  regions: string[];

  @ApiProperty({
    example: ['K-pop', '팝핑'],
    description: '강사 강의 장르',
    required: true,
  })
  @IsArray()
  @IsEnum(DanceCategory, { each: true })
  @IsNotEmpty()
  genres: DanceCategory[];

  @ApiProperty({
    example: ['URL', 'URL'],
    description: '그외 사이트',
    required: false,
  })
  @IsArray()
  @IsOptional()
  websiteUrls: string[];

  @ApiProperty({
    example: ['직접입력한 것들', '직접입력한 것들'],
    description: '기타일때 직접입력한 것들',
    required: false,
  })
  @IsArray()
  @IsOptional()
  etcGenres: string[];
}
