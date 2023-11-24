import { Module } from '@nestjs/common';
import { PassController } from '@src/pass/controllers/pass.controller';
import { PassService } from '@src/pass/services/pass.service';

@Module({
  controllers: [PassController],
  providers: [PassService],
})
export class PassModule {}
