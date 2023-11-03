import { Test, TestingModule } from '@nestjs/testing';
import { LectureReviewController } from './lecture-review.controller';

describe('LectureReviewController', () => {
  let controller: LectureReviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LectureReviewController],
    }).compile();

    controller = module.get<LectureReviewController>(LectureReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
