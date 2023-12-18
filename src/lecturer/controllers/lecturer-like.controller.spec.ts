import { Test, TestingModule } from '@nestjs/testing';
import { LecturerLikeController } from './lecturer-like.controller';

describe('LecturerLikeController', () => {
  let controller: LecturerLikeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LecturerLikeController],
    }).compile();

    controller = module.get<LecturerLikeController>(LecturerLikeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
