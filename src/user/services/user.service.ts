import { AuthService } from './../../auth/services/auth.service';
import { CreateUserDto } from '@src/user/dtos/create-user.dto';
import { UserRepository } from '@src/user/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { CreateUserAuthDto } from '@src/auth/dtos/create-user-auth.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async createUser(user: CreateUserDto) {
    const newUser = await this.userRepository.createUser(user);
    const auth: CreateUserAuthDto = {
      userId: newUser.id,
      authEmail: user.authEmail,
      signUpType: user.provider,
    };
    const newAuth = await this.authService.createUserAuth(auth);

    return { newUser, newAuth };
  }
}
