import { ApiProperty, PickType } from '@nestjs/swagger';
import { Auth, Users } from '@prisma/client';
import { SignUpType } from '@src/common/config/sign-up-type.config';
import { LecturerDto } from '@src/common/dtos/lecturer.dto';
import { UserDto } from '@src/common/dtos/user.dto';
import { ExtractEnumKeys } from '@src/common/utils/enum-key-extractor';
import { TransformEnumValue } from '@src/common/utils/enum-value-extractor';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
class PrivateAuthDto implements Pick<Auth, 'email' | 'signUpTypeId'> {
  @ApiProperty({
    description: '소셜 이메일',
  })
  @Expose()
  email: string;

  @ApiProperty({
    enum: SignUpType,
    description: `${ExtractEnumKeys(SignUpType)}`,
  })
  @Expose()
  signUpTypeId: number;

  constructor(auth: Partial<PrivateAuthDto>) {
    Object.assign(this, auth);
  }
}

@Exclude()
class PrivateUserDto implements Pick<UserDto, 'name'> {
  @ApiProperty({
    description: '이름',
  })
  @Expose()
  name: string;

  @ApiProperty({
    type: PrivateAuthDto,
    description: '소셜 정보',
  })
  @Expose()
  auth: PrivateAuthDto;

  constructor(user: Partial<PrivateUserDto>) {
    Object.assign(this, user);

    this.auth = new PrivateAuthDto(user.auth);
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
