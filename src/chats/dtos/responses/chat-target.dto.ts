import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ChatTargetDto {
  @Expose()
  @ApiProperty({ description: '유저 id', type: Number })
  userId?: number;

  @Expose()
  @ApiProperty({ description: '강사 id', type: Number })
  lecturerId?: number;

  constructor(target: ChatTargetDto) {
    Object.assign(this, target);
  }
}
