import { Injectable } from '@nestjs/common';
import { Id, Region } from '@src/common/interface/common-interface';
import { PrismaService } from '@src/prisma/prisma.service';

@Injectable()
export class RegionRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async getRegionsId(regions: Region[]): Promise<Id[]> {
    const regionsId: Id[] = await this.prismaService.region.findMany({
      where: { OR: regions },
      select: { id: true },
    });
    return regionsId;
  }
}
