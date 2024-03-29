import { ApiProperty } from '@nestjs/swagger';
import { Type, Expose, Exclude } from 'class-transformer';
import { PaymentPassUsageDto } from '../payment-pass-usage.dto';
import { BasicPaymentDto } from './basic-payment.dto';
import { LecturePaymentWithPassUsageDto } from './lecture-payment-with-pass-usage.dto';
import { ReservationWithLectureDto } from '@src/common/dtos/reservation-with-lecture.dto';
import { CardPaymentInfoDto } from '../card-payment-info.dto';
import { PaymentCouponUsageDto } from '../payment-coupon-usage.dto';
import { VirtualAccountPaymentInfoDto } from '../virtual-account-payment-info.dto';

@Exclude()
export class PaymentResultDto extends BasicPaymentDto {
  @ApiProperty({
    type: PaymentPassUsageDto,
    description: '패스권 사용 내역',
  })
  @Type(() => PaymentPassUsageDto)
  @Expose()
  paymentPassUsage: PaymentPassUsageDto;

  @ApiProperty({
    type: PaymentCouponUsageDto,
    description: '쿠폰 사용 내역',
    nullable: true,
  })
  @Type(() => PaymentCouponUsageDto)
  @Expose()
  paymentCouponUsage: PaymentCouponUsageDto;

  @ApiProperty({
    type: ReservationWithLectureDto,
    description: '예약 정보',
  })
  @Type(() => ReservationWithLectureDto)
  @Expose()
  reservation: ReservationWithLectureDto;

  @ApiProperty({
    type: CardPaymentInfoDto,
    description: '카드 결제 정보',
    nullable: true,
  })
  @Type(() => CardPaymentInfoDto)
  @Expose()
  cardPaymentInfo: CardPaymentInfoDto;

  @ApiProperty({
    type: VirtualAccountPaymentInfoDto,
    description: '가상 계좌 결제 정보',
    nullable: true,
  })
  @Type(() => VirtualAccountPaymentInfoDto)
  @Expose()
  virtualAccountPaymentInfo: VirtualAccountPaymentInfoDto;

  constructor(
    lecturePaymentWithPassUsage: Partial<LecturePaymentWithPassUsageDto>,
  ) {
    super();
    Object.assign(this, lecturePaymentWithPassUsage);
  }
}
