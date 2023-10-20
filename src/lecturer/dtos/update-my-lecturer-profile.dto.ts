import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { DanceCategory } from '@src/common/enum/enum';

export class UpdateMyLecturerProfileDto {
  @ApiProperty({
    description: `이미지 업로드 api에서 받아온 url배열`,
    example: ['url', 'url'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  newProfileImageUrls: string[];

  @ApiProperty({
    example: ['K-pop', '기타 장르들은 etcGenres로'],
    required: true,
  })
  @IsArray()
  @IsEnum(DanceCategory, { each: true })
  @IsNotEmpty()
  genres: DanceCategory[];

  @ApiProperty({
    example: ['기타일때 직접입력한 것들', '기타일때 직접입력한 것들'],
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
  @IsNotEmpty()
  regions: string[];

  @ApiProperty({
    example: ['그 외 사이트 url', '그 외 사이트 url'],
    description: '그외 사이트',
    required: false,
  })
  @IsArray()
  @IsOptional()
  websiteUrls: string[];
}
