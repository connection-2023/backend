import { ApiProperty, OmitType } from '@nestjs/swagger';
import { AuthDto } from '@src/common/dtos/auth.dto';
import { BaseReturnDto } from '@src/common/dtos/base-return.dto';
import { UserProfileImageDto } from '@src/common/dtos/user-profile-image.dto';
import { UserDto } from '@src/common/dtos/user.dto';
import { uuid } from 'aws-sdk/clients/customerprofiles';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PrivateUserProfileDto extends BaseReturnDto {
  @Expose()
  @ApiProperty({
    description: '유저 Id',
    type: Number,
  })
  id: number;

  @Expose()
  @ApiProperty({ description: '이름' })
  name: string;

  @Expose()
  @ApiProperty({
    description: '닉네임',
  })
  nickname: string;

  @Expose()
  @ApiProperty({ description: '이메일' })
  email: string;

  isProfileOpen: boolean;

  @Expose()
  @ApiProperty({ description: '핸드폰 번호' })
  phoneNumber: string | null;

  @Expose()
  @ApiProperty({
    description: '유저 프로필 이미지',
  })
  userProfileImage?: string;

  @Expose()
  @ApiProperty({ description: '소셜 정보', type: AuthDto })
  auth?: AuthDto;

  uuid: string;

  gender: number | null;
  deletedAt: Date;

  constructor(user: Partial<PrivateUserProfileDto>) {
    super();

    Object.assign(this, user);

    this.auth = new AuthDto(user.auth);
  }
}
