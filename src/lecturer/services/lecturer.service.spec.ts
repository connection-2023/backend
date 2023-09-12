import { Test, TestingModule } from '@nestjs/testing';
import { LecturerService } from './lecturer.service';

describe('LecturerService', () => {
  let service: LecturerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LecturerService],
    }).compile();

    service = module.get<LecturerService>(LecturerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
