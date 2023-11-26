import { Module } from '@nestjs/common';
import { PassController } from '@src/pass/controllers/pass.controller';
import { PassService } from '@src/pass/services/pass.service';
import { PassRepository } from './repository/pass.repository';

@Module({
  controllers: [PassController],
  providers: [PassService, PassRepository],
})
export class PassModule {}
