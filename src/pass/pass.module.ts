import { Module } from '@nestjs/common';
import { PassController } from '@src/pass/controllers/pass.controller';
import { PassService } from '@src/pass/services/pass.service';
import { PassRepository } from './repository/pass.repository';
import { UserPassService } from './services/user-pass.service';
import { UserPassController } from './controllers/user-pass.controller';

@Module({
  controllers: [PassController, UserPassController],
  providers: [PassService, PassRepository, UserPassService],
})
export class PassModule {}
