import { ApiProperty, PartialType } from '@nestjs/swagger';
import { RegularLectureScheduleDto } from '@src/common/dtos/regular-lecture-schedule.dto';
import { SimpleLectureDto } from '@src/lecturer/dtos/simple-lecture.dto';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RegularLectureScheduleWithLectureDto extends RegularLectureScheduleDto {
  @Expose()
  @ApiProperty({ description: '강의 정보', type: SimpleLectureDto })
  lecture?: SimpleLectureDto;

  constructor(
    regularLectureSchedule: Partial<RegularLectureScheduleWithLectureDto>,
  ) {
    super(regularLectureSchedule);

    Object.assign(this, regularLectureSchedule);

    this.lecture = new SimpleLectureDto(
      regularLectureSchedule.regularLectureStatus.lecture,
    );
  }
}
