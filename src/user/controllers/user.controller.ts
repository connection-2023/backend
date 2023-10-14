import { UploadsService } from '@src/uploads/uploads.service';
import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('유저')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly uploadsService: UploadsService,
  ) {}

  @ApiOperation({ summary: '회원가입' })
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createUser(
    @UploadedFile() image: Express.Multer.File,
    @Body() createUserDto: CreateUserDto,
  ) {
    const imageUrl = await this.uploadsService.uploadFileToS3('users', image);

    return this.userService.createUser(createUserDto, imageUrl);
  }
}
