import { ApiProperty } from '@nestjs/swagger';
import { DanceCategory } from '@src/common/enum/enum';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Matches,
} from 'class-validator';

export class CreateLecturerDto {
  @ApiProperty({
    example: ['url', 'url'],
  })
  @IsArray()
  @IsNotEmpty()
  profileImageUrls: string[];

  @ApiProperty({
    example: '올리버쌤',
    description: '닉네임 중복 확인 후 진행',
    required: true,
  })
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({
    example: 'illppang@naver.com',
    description: '이메일 / 이메일 형식이 아니면 에러 반환',
    required: true,
  })
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: '잘못된 이메일 형식입니다.',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '01012345678',
    description: '번호인증 후 포함',
    required: true,
  })
  @Matches(/^010\d{8}$/, { message: '유효하지 않은 전화번호 형식입니다.' })
  @IsNotEmpty()
  phoneNumber: string;

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
    example: '강사 소개글',
    description: '강사 소개',
    required: true,
  })
  @IsNotEmpty()
  introduction: string;

  @ApiProperty({
    example: '강사 경력',
    description: '강사 경력',
    required: true,
  })
  @IsNotEmpty()
  experience: string;

  @ApiProperty({
    example: ['서울특별시 도봉구', '서울특별시 중구'],
    required: false,
  })
  @IsArray()
  @IsNotEmpty()
  regions: string[];

  @ApiProperty({
    example: ['K-pop', '기타 장르들은 etcGenres로'],
    required: true,
  })
  @IsArray()
  @IsEnum(DanceCategory, { each: true })
  @IsNotEmpty()
  genres: DanceCategory[];

  @ApiProperty({
    example: ['그 외 사이트 url', '그 외 사이트 url'],

    description: '그외 사이트',
    required: false,
  })
  @IsArray()
  @IsOptional()
  websiteUrls: string[];

  @ApiProperty({
    example: ['기타일때 직접입력한 것들', '기타일때 직접입력한 것들'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  etcGenres: string[];
}
