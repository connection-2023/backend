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
    description: '업로드한 이미지의 url',
    example: ['url', 'url'],
    required: false,
  })
  newProfileImages: string[];

  @ApiProperty({
    example: [
      { profileImageId: 1, url: 'url' },
      { profileImageId: 0, url: 'url' },
    ],
    description: `이미지 순서가 [1, 2, 3] => [1, 3, 새이미지, 2] 순서로 변경된다면 =>
    [ {id:2 url:3번 이미지의 url,}, { id:3, url: 새 이미지는 url null,},{ id:0, url: 2번 url}] `,
    required: false,
  })
  @IsArray()
  @IsOptional()
  updatedProfileImageData: ProfileImageData[];

  @ApiProperty({
    example: [
      { profileImageId: 1, url: 'url' },
      { profileImageId: 2, url: 'url' },
    ],
    description: '삭제되는 이미지의 id 와 url',
    required: false,
  })
  @IsArray()
  @IsOptional()
  deletedProfileImageData: ProfileImageData[];
}
