import { LecturerLearnerDto } from '@src/common/dtos/lecturer-learner.dto';
import { ReservationDto } from '@src/common/dtos/reservation.dto';

export class LectureLearnerDto extends LecturerLearnerDto {
  reservation?: ReservationDto;

  constructor(LectureLearnerDto: Partial<LectureLearnerDto>) {
    super(LectureLearnerDto);
  }
}
