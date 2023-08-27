import { Test, TestingModule } from '@nestjs/testing';
import { LectureController } from './lecture.controller';

describe('LectureController', () => {
  let controller: LectureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LectureController],
    }).compile();

    controller = module.get<LectureController>(LectureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
