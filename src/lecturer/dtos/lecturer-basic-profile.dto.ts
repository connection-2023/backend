import { ApiProperty } from '@nestjs/swagger';
import { Users } from '@prisma/client';
import { LecturerDto } from '@src/common/dtos/lecturer.dto';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class LecturerBasicProfileDto
  implements
    Pick<
      LecturerDto,
      'id' | 'email' | 'nickname' | 'profileCardImageUrl' | 'phoneNumber'
    >
{
  @ApiProperty({
    type: Number,
    description: '강사 Id',
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: '이메일',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: '닉네임',
  })
  @Expose()
  nickname: string;

  @ApiProperty({
    description: '이름',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: '프로필 이미지',
  })
  @Expose()
  profileCardImageUrl: string;

  @ApiProperty({
    description: '전화번호',
  })
  @Expose()
  phoneNumber: string;

  @Exclude()
  users: Users;

  constructor(lecturer: Partial<LecturerBasicProfileDto>) {
    this.name = lecturer.users.name;

    Object.assign(this, lecturer);
  }
}
