import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class TargetDto {
  @Expose()
  @ApiProperty({ description: '유저 id' })
  userId: number;

  @Expose()
  @ApiProperty({ description: '강사 id' })
  lecturerId: number;

  constructor(target: Partial<TargetDto>) {
    Object.assign(this, target);
  }
}
