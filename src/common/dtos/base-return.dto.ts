import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class BaseReturnDto {
  @ApiProperty({
    description: '생성 시간',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정 시간',
    type: Date,
  })
  updatedAt: Date;
}
