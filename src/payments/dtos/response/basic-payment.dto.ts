import { ApiProperty } from '@nestjs/swagger';
import { Payment } from '@prisma/client';
import { BaseReturnWithSwaggerDto } from '@src/common/dtos/base-return-with-swagger.dto';
import { Exclude, Expose, Type } from 'class-transformer';
import { PaymentMethodDto } from '../payment-method.dto';
import { PaymentProductTypeDto } from '../payment-product-type.dto';
import { PaymentStatusDto } from '../payment-status.dto';

@Exclude()
export class BasicPaymentDto
  extends BaseReturnWithSwaggerDto
  implements Payment
{
  @ApiProperty({
    type: Number,
    description: '결제 Id',
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: '주문 uuid',
  })
  @Expose()
  orderId: string;

  @ApiProperty({
    description: '주문명',
  })
  @Expose()
  orderName: string;

  @ApiProperty({
    type: Number,
    description: '금액',
  })
  @Expose()
  originalPrice: number;

  @ApiProperty({
    type: Number,
    description: '최종 결제 금액',
  })
  @Expose()
  finalPrice: number;

  @ApiProperty({
    type: Date,
    description: '환불 마감일',
    nullable: true,
  })
  @Expose()
  refundableDate: Date;

  @ApiProperty({
    type: PaymentMethodDto,
    description: '결제 방식',
  })
  @Type(() => PaymentMethodDto)
  @Expose()
  paymentMethod: PaymentMethodDto;

  @ApiProperty({
    type: PaymentProductTypeDto,
    description: '결제 상품 타입',
  })
  @Type(() => PaymentProductTypeDto)
  @Expose()
  paymentProductType: PaymentProductTypeDto;

  @ApiProperty({
    type: PaymentStatusDto,
    description: '결제 상태',
  })
  @Type(() => PaymentStatusDto)
  @Expose()
  paymentStatus: PaymentStatusDto;

  userId: number;
  lecturerId: number;
  paymentMethodId: number;
  statusId: number;
  paymentKey: string;
  paymentProductTypeId: number;
  secret: string;
}
