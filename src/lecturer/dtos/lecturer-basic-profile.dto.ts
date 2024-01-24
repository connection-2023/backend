import { ApiProperty } from '@nestjs/swagger';
import { AuthDto } from '@src/common/dtos/auth.dto';
import { LecturerDto } from '@src/common/dtos/lecturer.dto';
import { UserDto } from '@src/common/dtos/user.dto';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
class PrivateUserDto implements Pick<UserDto, 'name'> {
  @ApiProperty({
    description: '이름',
  })
  @Expose()
  name: string;

  @Expose()
  @ApiProperty({
    description: '소셜 정보',
    type: AuthDto,
  })
  auth?: AuthDto;

  constructor(user: Partial<PrivateUserDto>) {
    Object.assign(this, user);

    this.auth = new AuthDto(user.auth);
  }
}

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
    description: '프로필 이미지',
  })
  @Expose()
  profileCardImageUrl: string;

  @ApiProperty({
    description: '전화번호',
  })
  @Expose()
  phoneNumber: string;

  @ApiProperty({
    type: PrivateUserDto,
    description: '전화번호',
  })
  @Expose()
  users: PrivateUserDto;

  constructor(lecturer: Partial<LecturerBasicProfileDto>) {
    Object.assign(this, lecturer);

    this.users = new PrivateUserDto(lecturer.users);
  }
}
