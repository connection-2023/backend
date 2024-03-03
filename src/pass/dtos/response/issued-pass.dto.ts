import { LecturePassTargetDto } from '@src/common/dtos/lecture-pass-target.dto';
import { LecturePassDto } from '@src/common/dtos/lecture-pass.dto';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class IssuedPassDto extends LecturePassDto {
  @Expose()
  @Type(() => LecturePassTargetDto)
  lecturePassTarget: LecturePassTargetDto[];
}
