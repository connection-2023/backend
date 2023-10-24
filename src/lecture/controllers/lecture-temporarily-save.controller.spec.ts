import { Test, TestingModule } from '@nestjs/testing';
import { LectureTemporarilySaveController } from './lecture-temporarily-save.controller';

describe('LectureTemporarilySaveController', () => {
  let controller: LectureTemporarilySaveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LectureTemporarilySaveController],
    }).compile();

    controller = module.get<LectureTemporarilySaveController>(LectureTemporarilySaveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
