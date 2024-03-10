import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { BasicReservationDto } from './basic-reservation.dto';
import { BasicLectureWithImageDto } from './basic-lecture-with-image.dto';

@Exclude()
export class ReservationWithLectureImageDto extends BasicReservationDto {
  @ApiProperty({
    type: BasicLectureWithImageDto,
    description: '강의 정보',
  })
  @Type(() => BasicLectureWithImageDto)
  @Expose()
  lecture: BasicLectureWithImageDto;
}
