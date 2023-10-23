import { Controller, Delete, Get, Param } from '@nestjs/common';
import { TestService } from '../services/test.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('test')
@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @ApiOperation({ summary: '유저 조회' })
  @Get()
  async getAllUsers() {
    return await this.testService.getAllUsers();
  }

  @ApiOperation({ summary: '유저 삭제' })
  @Delete(':userId')
  async deleteUser(@Param('userId') userId: number) {
    return await this.testService.deleteUser(userId);
  }
}
