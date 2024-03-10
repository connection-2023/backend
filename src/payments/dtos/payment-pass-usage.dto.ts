import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { PaymentPassUsage } from '@prisma/client';
import { LecturePassDto } from '@src/common/dtos/lecture-pass.dto';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
class PaymentPassUsageLecturePassDto extends PickType(LecturePassDto, [
  'id',
  'title',
]) {}
@Exclude()
export class PaymentPassUsageDto implements PaymentPassUsage {
  id: number;
  paymentId: number;
  lecturePassId: number;

  @ApiProperty({
    type: Number,
    description: '사용 횟수',
  })
  @Expose()
  usedCount: number;

  @ApiProperty({
    type: PaymentPassUsageLecturePassDto,
    description: '사용한 패스권 정보',
  })
  @Type(() => PaymentPassUsageLecturePassDto)
  @Expose()
  lecturePass: PaymentPassUsageLecturePassDto;

  constructor(paymentPassUsage: Partial<PaymentPassUsageDto>) {
    Object.assign(this, paymentPassUsage);
  }
}
