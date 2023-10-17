import { Module } from '@nestjs/common';
import { UserController } from '@src/user/controllers/user.controller';
import { UserService } from '@src/user/services/user.service';
import { UserRepository } from '@src/user/repositories/user.repository';
import { AuthModule } from '@src/auth/auth.module';
import { UploadsService } from '@src/uploads/services/uploads.service';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, UploadsService],
})
export class UserModule {}
