import { ApiProperty } from '@nestjs/swagger';
import { Lecture } from '@prisma/client';

export class PaymentBaseLectureDto implements Lecture {
  @ApiProperty({
    type: Number,
    description: '강의 Id',
  })
  id: number;

  @ApiProperty({
    description: '강의 명',
  })
  title: string;

  @ApiProperty({
    type: Number,
    description: '최대 정원',
  })
  maxCapacity: number;

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

  constructor(paymentBaseLecture: Partial<PaymentBaseLectureDto>) {
    this.id = paymentBaseLecture.id;
    this.title = paymentBaseLecture.title;
    this.maxCapacity = paymentBaseLecture.maxCapacity;

    Object.assign(this);
  }
}
