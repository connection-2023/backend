import { ApiProperty } from '@nestjs/swagger';
import { EnrollLectureListDto } from './enroll-lecture-list.dto';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CombinedEnrollLectureWithCountDto {
  @Expose()
  @ApiProperty({ description: '신청 목록', type: [EnrollLectureListDto] })
  enrollLectureList: EnrollLectureListDto[];

  @Expose()
  @ApiProperty({ description: '전체 수', type: Number })
  totalItemCount: number;

  constructor(enrollLectures: EnrollLectureListDto[], count?: number) {
    this.totalItemCount = count ? count : 0;
    this.enrollLectureList = enrollLectures
      ? enrollLectures.map(
          (enrollLecture) => new EnrollLectureListDto(enrollLecture),
        )
      : undefined;

    Object.assign(this);
  }
}
