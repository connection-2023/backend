import { Controller } from '@nestjs/common';
import { LectureTemporarilySaveService } from '@src/lecture/services/lecture-temporarily-save.service';

@Controller('lecture-temporarily-save')
export class LectureTemporarilySaveController {
  constructor(
    private readonly lectureTemporarilySaveService: LectureTemporarilySaveService,
  );
}
