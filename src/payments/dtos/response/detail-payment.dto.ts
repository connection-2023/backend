import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { CardPaymentInfoDto } from '../card-payment-info.dto';
import { PaymentCouponUsageDto } from '../payment-coupon-usage.dto';
import { PaymentPassUsageDto } from '../payment-pass-usage.dto';
import { RefundPaymentInfoDto } from '../refund-payment-info.dto';
import { VirtualAccountPaymentInfoDto } from '../virtual-account-payment-info.dto';
import { BasicPaymentDto } from './basic-payment.dto';
import { ReservationWithLectureImageDto } from '@src/common/dtos/reservation-with-lecture-image.dto';
import { UserPassDto } from '@src/common/dtos/user-pass.dto';

@Exclude()
export class DetailPaymentInfo extends BasicPaymentDto {
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
    type: ReservationWithLectureImageDto,
    description: '예약 정보',
  })
  @Type(() => ReservationWithLectureImageDto)
  @Expose()
  reservation: ReservationWithLectureImageDto;

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

  @ApiProperty({
    type: RefundPaymentInfoDto,
    description: '환불 정보',
  })
  @Type(() => RefundPaymentInfoDto)
  refundPaymentInfo: RefundPaymentInfoDto;

  @ApiProperty({
    type: UserPassDto,
    description: '구매한 유저 패스권 정보',
    nullable: true,
  })
  @Type(() => UserPassDto)
  @Expose()
  userPass: UserPassDto;
}
