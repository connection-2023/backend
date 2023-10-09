import {
  BadRequestException,
  INestApplication,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { DanceCategory, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    super();
  }
  async onModuleInit() {
    await this.$connect();
    await this.cachingDanceCategory();
  }

  async cachingDanceCategory() {
    const danceCategories: DanceCategory[] =
      await this.danceCategory.findMany();

    for (const danceCategory of danceCategories) {
      await this.cacheManager.set(danceCategory.genre, danceCategory.id);
    }

    this.logger.log('Cache success');
  }

  async enableShutdownHook(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
