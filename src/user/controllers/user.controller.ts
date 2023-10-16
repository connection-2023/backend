import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from '@src/uploads/uploads.service';
import { ApiCreateUser } from '../swagger-decorators/create-user';
import { ApiCheckDubplicatedNickname } from '../swagger-decorators/check-duplicated-nickname';

@ApiTags('유저')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly uploadsService: UploadsService,
  ) {}

  @ApiCreateUser()
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createUser(
    @UploadedFile() image: Express.Multer.File,
    @Body() createUserDto: CreateUserDto,
  ) {
    if (image) {
      const imageUrl = await this.uploadsService.uploadFileToS3('users', image);
      return await this.userService.createUser(createUserDto, imageUrl);
    } else {
      return await this.userService.createUser(createUserDto, null);
    }
  }

  @ApiCheckDubplicatedNickname()
  @Get(':nickname')
  async findByNickname(@Param('nickname') nickname: string) {
    return this.userService.findByNickname(nickname);
  }
}
