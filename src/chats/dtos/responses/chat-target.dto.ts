import { ApiProperty } from '@nestjs/swagger';
import { LecturerDto } from '@src/common/dtos/lecturer.dto';
import { UserDto } from '@src/common/dtos/user.dto';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class ChatTargetDto {
  @Expose()
  @ApiProperty({ description: '유저', type: UserDto })
  @Type(() => UserDto)
  user?: UserDto;

  @Expose()
  @ApiProperty({ description: '강사', type: LecturerDto })
  @Type(() => LecturerDto)
  lecturer?: LecturerDto;

  constructor(target: ChatTargetDto) {
    Object.assign(this, target);
  }
}
