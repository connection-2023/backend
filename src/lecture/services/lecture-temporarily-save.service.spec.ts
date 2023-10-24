import { Test, TestingModule } from '@nestjs/testing';
import { LectureTemporarilySaveService } from '@src/lecture/services/lecture-temporarily-save.service';

describe('LectureTemporarilySaveService', () => {
  let service: LectureTemporarilySaveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LectureTemporarilySaveService],
    }).compile();

    service = module.get<LectureTemporarilySaveService>(
      LectureTemporarilySaveService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
