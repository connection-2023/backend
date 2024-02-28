import { ApiProperty } from '@nestjs/swagger';
import { Users } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class BasicUserDto implements Pick<Users, 'id' | 'nickname'> {
  @ApiProperty({
    type: Number,
    description: '유저 Id',
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: '닉네임',
  })
  @Expose()
  nickname: string;
}
