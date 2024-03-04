import { ApiProperty } from '@nestjs/swagger';
import { Payment } from '@prisma/client';
import { BaseReturnWithSwaggerDto } from '@src/common/dtos/base-return-with-swagger.dto';
import { Exclude, Expose } from 'class-transformer';

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

  userId: number;
  lecturerId: number;
  paymentMethodId: number;
  statusId: number;
  paymentKey: string;
  paymentProductTypeId: number;
  secret: string;
}
