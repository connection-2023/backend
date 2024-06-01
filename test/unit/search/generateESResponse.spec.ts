import { Test, TestingModule } from '@nestjs/testing';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SearchService } from '@src/search/services/search.service';
import { PrismaService } from '@src/prisma/prisma.service'; // PrismaService를 임포트합니다.
import { PaginatedResponse } from '@src/common/types/type';
import { SearchRepository } from '@src/search/repository/search.repository';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: ElasticsearchService,
          useValue: {
            search: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {},
        },
        {
          provide: SearchRepository,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
  });

  describe('generateESResponse', () => {
    it('hits가 존재할 때 items를 포함한 PaginatedResponse를 반환해야 한다', () => {
      const hits = {
        total: { value: 2 },
        hits: [
          { _source: { id: 1, name: 'Item 1' } },
          { _source: { id: 2, name: 'Item 2' } },
        ],
      };

      const result = service.generateESResponse(hits, 'items');
      const expected: PaginatedResponse<{ id: number; name: string }, 'items'> =
        {
          totalItemCount: 2,
          items: [
            { id: 1, name: 'Item 1' },
            { id: 2, name: 'Item 2' },
          ],
        };

      expect(result).toEqual(expected);
    });

    it('hits가 존재하지 않을 때 빈 배열을 포함한 PaginatedResponse를 반환해야 한다', () => {
      const hits = {
        total: { value: 0 },
        hits: [],
      };

      const result = service.generateESResponse(hits, 'items');
      const expected: PaginatedResponse<{ id: number; name: string }, 'items'> =
        {
          totalItemCount: 0,
          items: [],
        };

      expect(result).toEqual(expected);
    });
  });
});
