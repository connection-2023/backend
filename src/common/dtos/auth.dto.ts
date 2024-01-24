import { ApiProperty } from '@nestjs/swagger';
import { SignUpTypeDto } from './sign-up-type.dto';
import { BaseReturnDto } from './base-return.dto';
import { UserDto } from './user.dto';
import { Exclude, Expose } from 'class-transformer';

export class AuthDto extends BaseReturnDto {
  @Exclude()
  id: number;

  @Exclude()
  userId: number;

  @Exclude()
  signUpType?: SignUpTypeDto;

  @Expose()
  @ApiProperty({ description: '소셜 이메일' })
  email: string;

  @Expose()
  @ApiProperty({ description: '가입 방식' })
  type: string;

  @Exclude()
  signUpTypeId: number;

  @Exclude()
  users: UserDto;

  constructor(auth: Partial<AuthDto>) {
    super();

    this.type = auth.signUpType.type;
    this.email = auth.email;

    Object.seal(this);
  }
}
