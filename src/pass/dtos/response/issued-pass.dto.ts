import { ApiProperty } from '@nestjs/swagger';
import { LecturePassTargetDto } from '@src/common/dtos/lecture-pass-target.dto';
import { LecturePassDto } from '@src/common/dtos/lecture-pass.dto';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class IssuedPassDto extends LecturePassDto {
  @ApiProperty({
    type: Number,
    description: '판매 수량',
  })
  @Expose()
  salesCount: number;

  @ApiProperty({
    type: [LecturePassTargetDto],
    description: '패스권 적용 대상',
  })
  @Type(() => LecturePassTargetDto)
  @Expose()
  lecturePassTarget: LecturePassTargetDto[];
}
