import { PartialType, PickType } from '@nestjs/swagger';
import { CreateLectureReviewDto } from './create-lecture-review.dto';

export class UpdateLectureReviewDto extends PartialType(
  PickType(CreateLectureReviewDto, ['description', 'stars'] as const),
) {}
