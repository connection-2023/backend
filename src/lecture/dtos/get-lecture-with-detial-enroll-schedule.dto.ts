import { ApiProperty, PartialType } from '@nestjs/swagger';
import { LectureNotificationDto } from '@src/common/dtos/lecture-notification.dto';
import { Exclude, Expose, Type } from 'class-transformer';
import { ILecture } from '../interface/lecture.interface';
import { LectureLocationDto } from '@src/common/dtos/lecture-location.dto';
import { LectureToRegionDto } from '@src/common/dtos/lecture-to-region.dto';
import { RegionDto } from '@src/common/dtos/region.dto';

@Exclude()
export class LectureWithDetailEnrollScheduleDto {
  @Expose()
  @ApiProperty({ description: '강의 id', type: Number })
  id: number;

  @Expose()
  @ApiProperty({ description: '강의 제목' })
  title: string;

  @Expose()
  @ApiProperty({ description: '공지사항', type: LectureNotificationDto })
  notification?: LectureNotificationDto;

  @Expose()
  @ApiProperty({ description: '강의 지역', type: LectureLocationDto })
  location?: LectureLocationDto;

  @Expose()
  @ApiProperty({ description: '지역', type: [RegionDto] })
  region?: RegionDto[];

  lectureToRegion?: LectureToRegionDto[];

  constructor(lecture: Partial<ILecture>) {
    Object.assign(this, lecture);

    this.location = lecture.lectureLocation
      ? new LectureLocationDto(lecture.lectureLocation)
      : undefined;
    this.notification = lecture.lectureNotification
      ? new LectureNotificationDto(lecture.lectureNotification)
      : undefined;
    this.region = lecture.lectureToRegion
      ? lecture.lectureToRegion.map(
          (lectureRegion) => new RegionDto(lectureRegion.region),
        )
      : undefined;
  }
}
