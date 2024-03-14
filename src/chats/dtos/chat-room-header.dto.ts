import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class OnlineListDto {
  @Expose()
  @ApiProperty({ description: '활동 중 강사', type: Number, required: false })
  lecturerId?: number;

  @Expose()
  @ApiProperty({ description: '활동 중 유저', type: Number, required: false })
  userId?: number;

  constructor(onlineList: OnlineListDto) {
    Object.assign(this, onlineList);
  }
}
