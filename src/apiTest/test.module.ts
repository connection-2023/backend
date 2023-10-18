import { Module } from '@nestjs/common';
import { TestController } from '@src/apiTest/controllers/test.controller';
import { TestService } from '@src/apiTest/services/test.service';

@Module({
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
