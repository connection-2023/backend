import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ReadManyLecturerMyReviewQueryDto } from './read-many-lecturer-my-review-query.dto';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderByEnum } from '@src/common/enum/enum';

export class ReadManyLecturerReviewQueryDto extends OmitType(
  ReadManyLecturerMyReviewQueryDto,
  ['lecturerMyReviewType', 'lectureId', 'orderBy'] as const,
) {
  @ApiProperty({
    enum: OrderByEnum,
  })
  @IsNotEmpty()
  @IsEnum(OrderByEnum, { each: true })
  orderBy: OrderByEnum;
}
