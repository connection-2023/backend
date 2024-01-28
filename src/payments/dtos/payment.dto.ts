import { Payment } from '@prisma/client';
import { TransferPaymentInfoDto } from './transfer-payment-info.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentProductTypeDto } from '@src/payments/dtos/payment-product-type.dto';
import { PaymentStatusDto } from '@src/payments/dtos/payment-status.dto';
import { PaymentMethodDto } from '@src/payments/dtos/payment-method.dto';
import { PaymentCouponUsageDto } from '@src/payments/dtos/payment-coupon-usage.dto';
import { RefundPaymentInfoDto } from '@src/payments/dtos/refund-payment-info.dto';
import { ReservationDto } from '@src/common/dtos/reservation.dto';
import { BaseReturnWithSwaggerDto } from '@src/common/dtos/base-return-with-swagger.dto';
import { PaymentPassUsageDto } from './payment-pass-usage.dto';
import { UserPassDto } from '@src/common/dtos/user-pass.dto';
import { VirtualAccountPaymentInfoDto } from './virtual-account-payment-info.dto';

export class PaymentDto extends BaseReturnWithSwaggerDto implements Payment {
  @ApiProperty({
    type: Number,
    description: '결제 Id',
  })
  id: number;

  @ApiProperty({
    description: '주문 uuid',
  })
  orderId: string;

  @ApiProperty({
    description: '주문명',
  })
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
    type: PaymentMethodDto,
    description: '결제 방식',
  })
  paymentMethod: PaymentMethodDto;

  @ApiProperty({
    type: PaymentStatusDto,
    description: '결제 상태',
  })
  paymentStatus: PaymentStatusDto;

  @ApiProperty({
    type: PaymentCouponUsageDto,
    description: '쿠폰 사용 내역',
    nullable: true,
  })
  paymentCouponUsage: PaymentCouponUsageDto;

  @ApiProperty({
    type: VirtualAccountPaymentInfoDto,
    description: '가상 계좌 결제 정보',
  })
  virtualAccountPaymentInfo: VirtualAccountPaymentInfoDto;

  @ApiProperty({
    type: TransferPaymentInfoDto,
    description: '계좌 이체 정보',
    nullable: true,
  })
  transferPaymentInfo: TransferPaymentInfoDto;

  @ApiProperty({
    type: RefundPaymentInfoDto,
    description: '환불 정보',
    nullable: true,
  })
  refundPaymentInfo: RefundPaymentInfoDto;

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
    type: UserPassDto,
    description: '구매한 유저 패스권 정보',
  })
  userPass: UserPassDto;
  secret: string;

  constructor(payment: Partial<PaymentDto>) {
    super();
    this.id = payment.id;
    this.orderId = payment.orderId;
    this.orderName = payment.orderName;
    this.originalPrice = payment.originalPrice;
    this.finalPrice = payment.finalPrice;

    this.paymentProductType = new PaymentProductTypeDto(
      payment.paymentProductType,
    );
    this.paymentStatus = new PaymentStatusDto(payment.paymentStatus);
    this.paymentMethod = payment.paymentMethod
      ? new PaymentMethodDto(payment.paymentMethod)
      : null;
    this.reservation = payment.reservation
      ? new ReservationDto(payment.reservation)
      : null;
    this.paymentCouponUsage = payment.paymentCouponUsage
      ? new PaymentCouponUsageDto(payment.paymentCouponUsage)
      : null;
    this.virtualAccountPaymentInfo = payment.virtualAccountPaymentInfo
      ? new VirtualAccountPaymentInfoDto(payment.virtualAccountPaymentInfo)
      : null;
    this.transferPaymentInfo = payment.transferPaymentInfo
      ? new TransferPaymentInfoDto(payment.transferPaymentInfo)
      : null;
    this.refundPaymentInfo = payment.refundPaymentInfo
      ? new RefundPaymentInfoDto(payment.refundPaymentInfo)
      : null;
    this.paymentPassUsage = payment.paymentPassUsage
      ? new PaymentPassUsageDto(payment.paymentPassUsage)
      : null;
    this.userPass = payment.userPass ? new UserPassDto(payment.userPass) : null;

    Object.assign(this);
  }
}
