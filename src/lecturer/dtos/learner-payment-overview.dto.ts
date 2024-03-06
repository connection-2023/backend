import { LearnerPassDto } from './learner-pass.dto';
import { ReservationDto } from '@src/common/dtos/reservation.dto';
import { PaymentCouponUsageDto } from '@src/payments/dtos/payment-coupon-usage.dto';
import { PaymentPassUsageDto } from '@src/payments/dtos/payment-pass-usage.dto';
import { PaymentProductTypeDto } from '@src/payments/dtos/payment-product-type.dto';
import { Payment } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { BaseReturnWithSwaggerDto } from '@src/common/dtos/base-return-with-swagger.dto';

export class LearnerPaymentOverviewDto
  extends BaseReturnWithSwaggerDto
  implements Payment
{
  @ApiProperty({
    type: Number,
    description: '결제 Id',
  })
  id: number;

  orderId: string;
  orderName: string;

  @ApiProperty({
    type: Number,
    description: '금액',
  })
  originalPrice: number;

  @ApiProperty({
    type: Number,
    description: '최종 결제 금액',
  })
  finalPrice: number;

  refundableDate: Date;
  userId: number;
  lecturerId: number;
  paymentMethodId: number;
  statusId: number;
  paymentKey: string;
  paymentProductTypeId: number;

  @ApiProperty({
    type: PaymentProductTypeDto,
    description: '결제 상품 종류',
  })
  paymentProductType: PaymentProductTypeDto;

  @ApiProperty({
    type: PaymentCouponUsageDto,
    description: '쿠폰 사용 내역',
    nullable: true,
  })
  paymentCouponUsage: PaymentCouponUsageDto;

  @ApiProperty({
    type: ReservationDto,
    description: '예약 정보',
    nullable: true,
  })
  reservation: ReservationDto;

  @ApiProperty({
    type: PaymentPassUsageDto,
    description: '패스권 사용 정보',
    nullable: true,
  })
  paymentPassUsage: PaymentPassUsageDto;

  @ApiProperty({
    type: LearnerPassDto,
    description: '구매한 유저 패스권 정보',
  })
  userPass: LearnerPassDto;
  secret: string;

  constructor(learnerOverview: Partial<LearnerPaymentOverviewDto>) {
    super();

    this.id = learnerOverview.id;
    this.orderId = learnerOverview.orderId;
    this.orderName = learnerOverview.orderName;
    this.originalPrice = learnerOverview.originalPrice;
    this.finalPrice = learnerOverview.finalPrice;

    this.paymentProductType = new PaymentProductTypeDto(
      learnerOverview.paymentProductType,
    );

    this.reservation = learnerOverview.reservation
      ? new ReservationDto(learnerOverview.reservation)
      : null;
    this.paymentCouponUsage = learnerOverview.paymentCouponUsage
      ? new PaymentCouponUsageDto(learnerOverview.paymentCouponUsage)
      : null;
    this.paymentPassUsage = learnerOverview.paymentPassUsage
      ? new PaymentPassUsageDto(learnerOverview.paymentPassUsage)
      : null;
    this.userPass = learnerOverview.userPass
      ? new LearnerPassDto(learnerOverview.userPass)
      : null;

    Object.assign(this);
  }
}
