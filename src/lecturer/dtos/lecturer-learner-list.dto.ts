import { ApiProperty } from '@nestjs/swagger';
import { LecturerLearnerDto } from '@src/common/dtos/lecturer-learner.dto';

export class LecturerLearnerListDto {
  @ApiProperty({
    description: '총 개수',
    type: Number,
  })
  totalItemCount: number;

  @ApiProperty({
    description: '수강생 정보',
    type: LecturerLearnerDto,
    isArray: true,
  })
  lecturerLearnerList: LecturerLearnerDto[];

  constructor(data) {
    this.totalItemCount = data.totalItemCount;
    this.lecturerLearnerList = data.lecturerLearnerList
      ? data.lecturerLearnerList.map(
          (lecturerLearner) => new LecturerLearnerDto(lecturerLearner),
        )
      : [];

    Object.seal(this);
  }
}
