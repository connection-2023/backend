import { ApiProperty } from '@nestjs/swagger';
import { BaseReturnWithSwaggerDto } from './base-return-with-swagger.dto';
import { LecturePass } from '@prisma/client';

export class LecturePassDto
  extends BaseReturnWithSwaggerDto
  implements LecturePass
{
  @ApiProperty({
    type: Number,
    description: '패스권 Id',
  })
  id: number;
  lecturerId: number;

  @ApiProperty({
    description: '패스권 Id',
    type: Number,
  })
  title: string;

  @ApiProperty({
    description: '가격',
    type: Number,
  })
  price: number;

  @ApiProperty({
    description: '사용 가능 횟수',
    type: Number,
  })
  maxUsageCount: number;

  @ApiProperty({
    description: '사용 가능 기간',
    type: Number,
  })
  availableMonths: number;
  salesCount: number;
  isDisabled: boolean;
  deletedAt: Date;

  constructor(lecturePass: Partial<LecturePassDto>) {
    super();
    this.id = lecturePass.id;
    this.title = lecturePass.title;
    this.price = lecturePass.price;
    this.maxUsageCount = lecturePass.maxUsageCount;
    this.availableMonths = lecturePass.availableMonths;

    Object.assign(this);
  }
}
