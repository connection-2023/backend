import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ApiCreateUser } from '../swagger-decorators/create-user';
import { ApiCheckDubplicatedNickname } from '../swagger-decorators/check-duplicated-nickname';

@ApiTags('유저')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiCreateUser()
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @ApiCheckDubplicatedNickname()
  @Get(':nickname')
  async findByNickname(@Param('nickname') nickname: string) {
    return this.userService.findByNickname(nickname);
  }
}
