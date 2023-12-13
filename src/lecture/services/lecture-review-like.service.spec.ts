import { Test, TestingModule } from '@nestjs/testing';
import { LectureReviewLikeService } from './lecture-review-like.service';

describe('LectureReviewLikeService', () => {
  let service: LectureReviewLikeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LectureReviewLikeService],
    }).compile();

    service = module.get<LectureReviewLikeService>(LectureReviewLikeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
