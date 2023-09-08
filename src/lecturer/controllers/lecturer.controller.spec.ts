import { Test, TestingModule } from '@nestjs/testing';
import { LecturerController } from './lecturer.controller';

describe('LecturerController', () => {
  let controller: LecturerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LecturerController],
    }).compile();

    controller = module.get<LecturerController>(LecturerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
