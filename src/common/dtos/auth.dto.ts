import { ApiProperty } from '@nestjs/swagger';
import { SignUpTypeDto } from './sign-up-type.dto';
import { UserDto } from './user.dto';
import { Exclude, Expose } from 'class-transformer';
import { ExtractEnumKeys } from '../utils/enum-key-extractor';
import { SignUpType } from '../config/sign-up-type.config';
import { Auth } from '@prisma/client';

@Exclude()
export class AuthDto implements Auth {
  id: number;
  userId: number;
  signUpTypeId: number;
  createdAt: Date;
  deletedAt: Date;

  @Expose()
  @ApiProperty({ description: '소셜 이메일' })
  email: string;

  @Expose()
  @ApiProperty({
    enum: ExtractEnumKeys(SignUpType),
    description: '가입 방식',
  })
  type?: string;

  signUpType?: SignUpTypeDto;
  users?: UserDto;

  constructor(auth: Partial<AuthDto>) {
    Object.assign(this, auth);

    this.signUpType = new SignUpTypeDto(auth.signUpType);
    this.type = this.signUpType.type;
  }
}
