import { Module } from '@nestjs/common';
import { UserController } from '../user/controllers/user.controller';
import { UserService } from '../user/services/user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
