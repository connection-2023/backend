import { UploadsService } from '@src/uploads/services/uploads.service';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ApiCreateUser } from '../swagger-decorators/create-user';
import { ApiCheckDubplicatedNickname } from '../swagger-decorators/check-duplicated-nickname';
import { ApiCreateUserImage } from '../swagger-decorators/create-user-image';
import { UserAccessTokenGuard } from '@src/common/guards/user-access-token.guard';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { Users } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidateResult } from '@src/common/interface/common-interface';
import { ApiReadMyProfile } from '../swagger-decorators/read-my-profile';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { ApiUpdateUser } from '../swagger-decorators/update-user.decorator';

@ApiTags('유저')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly uploadsService: UploadsService,
  ) {}

  @ApiCreateUser()
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @ApiCreateUserImage()
  @UseGuards(UserAccessTokenGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post('images')
  async createUserImage(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const findByUserId = await this.userService.findByUserId(
      authorizedData.user.id,
    );
    if (findByUserId) {
      throw new HttpException(
        '이미 프로필 사진이 존재하는 유저입니다',
        HttpStatus.BAD_REQUEST,
      );
    }

    const imageUrl = await this.uploadsService.uploadFileToS3('users', image);
    const newUserImage = await this.userService.createUserImage(
      authorizedData.user.id,
      imageUrl,
    );

    return { newUserImage };
  }

  @ApiCheckDubplicatedNickname()
  @Get('/nicknames/:nickname')
  async findByNickname(@Param('nickname') nickname: string) {
    return this.userService.findByNickname(nickname);
  }

  @ApiReadMyProfile()
  @UseGuards(UserAccessTokenGuard)
  @Get('my-pages')
  async getMyProfile(@GetAuthorizedUser() authorizedData: ValidateResult) {
    const myProfile = await this.userService.getMyProfile(
      authorizedData.user.id,
    );

    return { myProfile };
  }

  @ApiUpdateUser()
  @UseGuards(UserAccessTokenGuard)
  @Patch('my-pages')
  async updateUser(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Body() updateMyProfileDto: UpdateUserDto,
  ) {
    return await this.userService.updateUser(
      authorizedData.user.id,
      updateMyProfileDto,
    );
  }
}
