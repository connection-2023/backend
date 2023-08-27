import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { User } from './user';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [User, UserService]
})
export class UserModule {}
