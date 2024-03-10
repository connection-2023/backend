import { ApiProperty } from '@nestjs/swagger';
import { Type, Expose, Exclude } from 'class-transformer';
import { BasicLectureDto } from './basic-lecture.dto';
import { BasicReservationDto } from './basic-reservation.dto';

@Exclude()
export class ReservationWithLectureDto extends BasicReservationDto {
  @ApiProperty({
    type: BasicLectureDto,
    description: '강의 정보',
  })
  @Type(() => BasicLectureDto)
  @Expose()
  lecture: BasicLectureDto;
}
