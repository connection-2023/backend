import { ApiProperty } from '@nestjs/swagger';
import { LectureCouponTarget } from '@prisma/client';
import { CouponLectureDto } from '@src/coupon/dtos/coupon-lecture.dto';

export class LectureCouponTargetDto implements LectureCouponTarget {
  id: number;
  lectureCouponId: number;
  lectureId: number;

  @ApiProperty({
    description: '강의 정보',
    type: CouponLectureDto,
  })
  lecture?: CouponLectureDto;

  constructor(lectureCouponTarget: Partial<LectureCouponTargetDto>) {
    this.lecture = lectureCouponTarget.lecture
      ? new CouponLectureDto(lectureCouponTarget.lecture)
      : null;

    Object.seal(this);
  }
}
