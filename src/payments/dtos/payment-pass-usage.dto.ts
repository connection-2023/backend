import { ApiProperty } from '@nestjs/swagger';
import { PaymentPassUsage } from '@prisma/client';
import { LecturePassDto } from '@src/common/dtos/lecture-pass.dto';

export class PaymentPassUsageDto implements PaymentPassUsage {
  id: number;
  paymentId: number;
  lecturePassId: number;

  @ApiProperty({
    type: Number,
    description: '사용량',
  })
  usedCount: number;

  @ApiProperty({
    type: LecturePassDto,
    description: '사용한 패스권 정보',
  })
  lecturePass: LecturePassDto;

  constructor(paymentPassUsage: Partial<PaymentPassUsageDto>) {
    this.usedCount = paymentPassUsage.usedCount;
    this.lecturePass = paymentPassUsage.lecturePass
      ? new LecturePassDto(paymentPassUsage.lecturePass)
      : null;
  }
}
