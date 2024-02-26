import { ApiProperty } from '@nestjs/swagger';
import { Lecturer } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class BasicLecturerDto
  implements Pick<Lecturer, 'id' | 'nickname' | 'profileCardImageUrl'>
{
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
    description: '프로필 카드 이미지',
  })
  @Expose()
  profileCardImageUrl: string;

  constructor(lecturer: Partial<BasicLecturerDto>) {}
}
