import { Test, TestingModule } from '@nestjs/testing';
import { LectureLikeService } from './lecture-like.service';

describe('LectureLikeService', () => {
  let service: LectureLikeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LectureLikeService],
    }).compile();

    service = module.get<LectureLikeService>(LectureLikeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
