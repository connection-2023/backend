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
}
