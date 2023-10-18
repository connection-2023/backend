import { ApiProperty } from '@nestjs/swagger';
import { DanceCategory } from '@src/common/enum/enum';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Matches,
} from 'class-validator';
import { ProfileImageData } from '../interface/lecturer.interface';

export class UpdateMyLecturerProfileDto {
  @ApiProperty({
    description: `다중 이미지 업로드 api에서 받아온 url배열`,
    example: ['url', 'url'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  newProfileImageUrls: string[];

  @ApiProperty({
    example: [
      { profileImageId: 1, url: '수정된 이미지url' },
      { profileImageId: 12, url: '새로운 이미지일때 null' },
      { profileImageId: 0, url: '이미지가 더 추가됐으면 id: 0' },
    ],
    required: false,
  })
  @IsArray()
  @IsOptional()
  updatedProfileImageData: ProfileImageData[];

  @ApiProperty({
    description: '삭제되는 이미지의 id 와 url',
    example: [
      { profileImageId: 1, url: 'url' },
      { profileImageId: 2, url: 'url' },
    ],
    required: false,
  })
  @IsArray()
  @IsOptional()
  deletedProfileImageData: ProfileImageData[];
}
