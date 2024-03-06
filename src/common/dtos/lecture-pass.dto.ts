import { ApiProperty } from '@nestjs/swagger';
import { BaseReturnWithSwaggerDto } from './base-return-with-swagger.dto';
import { LecturePass } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
@Exclude()
export class LecturePassDto
  extends BaseReturnWithSwaggerDto
  implements Partial<LecturePass>
{
  @ApiProperty({
    type: Number,
    description: '패스권 Id',
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: '패스권 Id',
    type: Number,
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: '가격',
    type: Number,
  })
  @Expose()
  price: number;

  @ApiProperty({
    description: '사용 가능 횟수',
    type: Number,
  })
  @Expose()
  maxUsageCount: number;

  @ApiProperty({
    description: '사용 가능 기간',
    type: Number,
  })
  @Expose()
  availableMonths: number;

  constructor(lecturePass: Partial<LecturePassDto>) {
    super();

    Object.assign(this, lecturePass);
  }
}
