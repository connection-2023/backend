import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ValidateIf } from 'class-validator';

@Exclude()
export class OnlineMapDto {
  @Expose()
  @ApiProperty({ description: '마지막 로그인 시간' })
  lastLogin: Date;

  userId?: number;
  lecturerId?: number;
  socketId?: string;
  constructor(onlineMap: OnlineMapDto) {
    Object.assign(this, onlineMap['_doc']);
  }
}
