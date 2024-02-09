import { ApiProperty } from '@nestjs/swagger';
import { BaseReturnWithSwaggerDto } from '@src/common/dtos/base-return-with-swagger.dto';
import { Exclude, Expose, Type } from 'class-transformer';
import { PaymentStatusDto } from '../payment-status.dto';
import { PaymentCouponUsageDto } from '../payment-coupon-usage.dto';
import { ExtractEnumKeys } from '@src/common/utils/enum-key-extractor';
import { LecturerPaymentStatus } from '@src/payments/enum/payment.enum';
@Exclude()
class PrivateLecturerPaymentStatus extends PaymentStatusDto {
  @ApiProperty({
    enum: ExtractEnumKeys(LecturerPaymentStatus),
    description: '결제 상태',
  })
  @Expose()
  name: string;
  constructor() {
    super();
  }
}
@Exclude()
export class LecturerPaymentItemDto extends BaseReturnWithSwaggerDto {
  @ApiProperty({
    type: Number,
    description: '결제 상태',
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: '주문명',
  })
  @Expose()
  orderName: string;

  @ApiProperty({
    type: Number,
    description: '할인 적용 전 결제 금액',
  })
  @Expose()
  originalPrice: number;

  @ApiProperty({
    type: Number,
    description: '할인 적용 후 최종 결제 금액',
  })
  @Expose()
  finalPrice: number;

  @ApiProperty({
    type: PrivateLecturerPaymentStatus,
    description: '결제 상태',
  })
  @Type(() => PrivateLecturerPaymentStatus)
  @Expose()
  paymentStatus: PrivateLecturerPaymentStatus;

  @ApiProperty({
    type: PaymentCouponUsageDto,
    description: '쿠폰 사용 내역',
  })
  @Type(() => PaymentStatusDto)
  @Expose()
  paymentCouponUsage: PaymentCouponUsageDto;

  constructor(lecturerPayment: Partial<LecturerPaymentItemDto>) {
    super();

    Object.assign(this, lecturerPayment);
  }
}
