import { Test, TestingModule } from '@nestjs/testing';
import { LectureLikeController } from './lecture-like.controller';

describe('LectureLikeController', () => {
  let controller: LectureLikeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LectureLikeController],
    }).compile();

    controller = module.get<LectureLikeController>(LectureLikeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
