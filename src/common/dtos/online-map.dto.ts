import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class OnlineMapDto {
  @Expose()
  @ApiProperty({ description: '마지막 로그인 시간' })
  @Transform(
    ({ value }) => new Date(new Date(value).getTime() + 9 * 60 * 60 * 1000),
  )
  lastLogin: Date;

  userId?: number;
  lecturerId?: number;
  socketId?: string;
  constructor(onlineMap: OnlineMapDto) {
    Object.assign(this, onlineMap['_doc']);
  }
}
