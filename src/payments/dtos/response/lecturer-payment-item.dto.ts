import { Payment } from '@prisma/client';
import { PaymentDto } from '../payment.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { BaseReturnWithSwaggerDto } from '@src/common/dtos/base-return-with-swagger.dto';
import { Exclude, Expose, Type } from 'class-transformer';
import { PaymentStatusDto } from '../payment-status.dto';

@Exclude()
export class LecturerPaymentItemDto extends BaseReturnWithSwaggerDto {
  id: number;
  orderName: string;
  originalPrice: number;
  finalPrice: number;
  @ApiProperty({
    type: PaymentStatusDto,
    description: '결제 상태',
  })
  @Type(() => PaymentStatusDto)
  @Expose()
  paymentStatus: PaymentStatusDto;

  constructor(lecturerPayment: Partial<LecturerPaymentItemDto>) {
    super();
    console.log(lecturerPayment);

    Object.assign(this, lecturerPayment);
  }
}
