import { ApiProperty } from '@nestjs/swagger';
import { SignUpType } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SignUpTypeDto implements SignUpType {
  id: number;

  @Expose()
  @ApiProperty({ description: '로그인 방식' })
  type: string;

  constructor(type: Partial<SignUpTypeDto>) {
    Object.assign(this, type);
  }
}
