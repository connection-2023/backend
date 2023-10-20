import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';

export class UpdateMyLecturerProfileDto {
  @ApiProperty({
    description: `이미지 업로드 api에서 받아온 url배열`,
    example: ['url', 'url'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  newProfileImageUrls: string[];
}
