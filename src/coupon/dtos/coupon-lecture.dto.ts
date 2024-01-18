import { ApiProperty } from '@nestjs/swagger';
import { Lecture } from '@prisma/client';

export class CouponLectureDto implements Lecture {
  @ApiProperty({
    description: '강의 id',
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: '강의 이름',
  })
  title: string;

  lecturerId: number;
  lectureTypeId: number;
  lectureMethodId: number;
  isGroup: boolean;
  startDate: Date;
  endDate: Date;
  introduction: string;
  curriculum: string;
  duration: number;
  difficultyLevel: string;
  minCapacity: number;
  maxCapacity: number;
  reservationDeadline: number;
  reservationComment: string;
  price: number;
  noShowDeposit: number;
  reviewCount: number;
  stars: number;
  isActive: boolean;
  locationDescription: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(couponLecture: Partial<CouponLectureDto>) {
    this.id = couponLecture.id;
    this.title = couponLecture.title;

    Object.seal(this);
  }
}
