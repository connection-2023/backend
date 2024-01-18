import { Test, TestingModule } from '@nestjs/testing';
import { LecturerLikeService } from './lecturer-like.service';

describe('LecturerLikeService', () => {
  let service: LecturerLikeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LecturerLikeService],
    }).compile();

    service = module.get<LecturerLikeService>(LecturerLikeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
