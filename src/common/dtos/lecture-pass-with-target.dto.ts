import { LecturePassTargetDto } from './lecture-pass-target.dto';
import { ApiProperty } from '@nestjs/swagger';
import { BaseReturnWithSwaggerDto } from './base-return-with-swagger.dto';
import { LecturePass } from '@prisma/client';

export class LecturePassWithTargetDto
  extends BaseReturnWithSwaggerDto
  implements LecturePass
{
  @ApiProperty({
    description: '패스권 Id',
    type: Number,
  })
  id: number;
  lecturerId: number;

  @ApiProperty({
    description: '패스권명',
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

  @ApiProperty({
    description: '적용된 강의',
    type: [LecturePassTargetDto],
  })
  lecturePassTarget: LecturePassTargetDto[];

  constructor(lecturePass: Partial<LecturePassWithTargetDto>) {
    super();
    this.id = lecturePass.id;
    this.title = lecturePass.title;
    this.price = lecturePass.price;
    this.maxUsageCount = lecturePass.maxUsageCount;
    this.availableMonths = lecturePass.availableMonths;
    this.createdAt = lecturePass.createdAt;
    this.updatedAt = lecturePass.updatedAt;

    this.lecturePassTarget = lecturePass.lecturePassTarget
      ? lecturePass.lecturePassTarget.map(
          (passTarget) => new LecturePassTargetDto(passTarget),
        )
      : null;

    Object.assign(this);
  }
}
