import { Test, TestingModule } from '@nestjs/testing';
import { LectureReviewService } from './lecture-review.service';

describe('LectureReviewService', () => {
  let service: LectureReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LectureReviewService],
    }).compile();

    service = module.get<LectureReviewService>(LectureReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
