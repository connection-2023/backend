import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserAuthDto } from '@src/auth/dtos/create-user-auth.dto';
import { AuthService } from '@src/auth/services/auth.service';
import { ApiCreateUserAuth } from '@src/auth/swagger-decorators/auth/create-user-auth-decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreateUserAuth()
  @Post()
  async createUserAuth(@Body() createUserAuthDto: CreateUserAuthDto) {
    await this.authService.createUserAuth(createUserAuthDto);

    return { message: 'auth 정보 등록 완료' };
  }
}
