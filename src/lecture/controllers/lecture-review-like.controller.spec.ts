import { Test, TestingModule } from '@nestjs/testing';
import { LectureReviewLikeController } from './lecture-review-like.controller';

describe('LectureReviewLikeController', () => {
  let controller: LectureReviewLikeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LectureReviewLikeController],
    }).compile();

    controller = module.get<LectureReviewLikeController>(LectureReviewLikeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
