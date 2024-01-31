import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { LecturePass } from '@prisma/client';
import { BaseReturnWithSwaggerDto } from '@src/common/dtos/base-return-with-swagger.dto';
import { Exclude, Expose } from 'class-transformer';
import { LectureDto } from '@src/common/dtos/lecture.dto';

@Exclude()
class PrivateLectureDto extends PartialType(
  PickType(LectureDto, ['id', 'title']),
) {
  @ApiProperty({
    type: Number,
    description: '강의 Id',
  })
  @Expose()
  id: number;

  @ApiProperty({
    type: Number,
    description: '강의 제목',
  })
  @Expose()
  title: string;

  constructor(lecture: Partial<PrivateLectureDto>) {
    super();
    Object.assign(this, lecture);
  }
}

@Exclude()
class PrivateLecturePassTarget {
  @ApiProperty({
    type: PrivateLectureDto,
    description: '강의 정보',
  })
  @Expose()
  lecture: PrivateLectureDto;

  constructor(lecturePassTarget: Partial<PrivateLecturePassTarget>) {
    this.lecture = new PrivateLectureDto(lecturePassTarget.lecture);
  }
}

@Exclude()
export class MyPassDto extends BaseReturnWithSwaggerDto implements LecturePass {
  @ApiProperty({
    type: Number,
    description: '패스권 Id',
  })
  @Expose()
  id: number;
  lecturerId: number;
  @ApiProperty({
    description: '패스권명',
  })
  @Expose()
  title: string;
  @ApiProperty({
    type: Number,
    description: '가격',
  })
  @Expose()
  price: number;

  @ApiProperty({
    type: Number,
    description: '사용 가능 횟수',
  })
  @Expose()
  maxUsageCount: number;

  @ApiProperty({
    type: Number,
    description: '사용 가능 기간',
  })
  @Expose()
  availableMonths: number;

  @ApiProperty({
    type: Number,
    description: '판매 횟수',
  })
  @Expose()
  salesCount: number;
  isDisabled: boolean;
  deletedAt: Date;

  @ApiProperty({
    description: '적용된 강의',
    type: [PrivateLecturePassTarget],
  })
  @Expose()
  lecturePassTarget: PrivateLecturePassTarget[];

  constructor(myPass: Partial<MyPassDto>) {
    super();

    Object.assign(this, myPass);

    this.lecturePassTarget =
      myPass.lecturePassTarget && myPass.lecturePassTarget[0]
        ? myPass.lecturePassTarget.map(
            (passTarget) => new PrivateLecturePassTarget(passTarget),
          )
        : null;
  }
}
