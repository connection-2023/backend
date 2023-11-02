import { Controller, Delete, Get, Param } from '@nestjs/common';
import { TestService } from '../services/test.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('test')
@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @ApiOperation({ summary: '유저 조회' })
  @Get('users')
  async getAllUsers() {
    return await this.testService.getAllUsers();
  }

  @ApiOperation({ summary: '유저 삭제' })
  @Delete('users/:userId')
  async deleteUser(@Param('userId') userId: number) {
    return await this.testService.deleteUser(userId);
  }

  @ApiOperation({ summary: '강사 조회' })
  @Get('lecturers')
  async getAllLecturer() {
    return await this.testService.getAllLecturer();
  }

  @ApiOperation({ summary: '강사 삭제' })
  @Delete('lecturers/:lecturerId')
  async deleteLecturer(@Param('lecturerId') lecturerId: number) {
    return await this.testService.deleteLecturer(lecturerId);
  }
}
