import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserAccessTokenGuard } from '@src/common/guards/user-access-token.guard';
import { LecturerLikeService } from '../services/lecturer-like.service';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { ValidateResult } from '@src/common/interface/common-interface';
import { ApiCreateLecturerLike } from '../swagger-decorators/create-lecturer-like-decorator';
import { ApiReadManyLecturerLike } from '../swagger-decorators/get-lecturer-like-decorator';

@ApiTags('강사 좋아요')
@Controller('lecturer-likes')
export class LecturerLikeController {
  constructor(private readonly lecturerLikeService: LecturerLikeService) {}

  @ApiCreateLecturerLike()
  @UseGuards(UserAccessTokenGuard)
  @Post(':lecturerId')
  async createLecturerLike(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Param('lecturerId', ParseIntPipe) lecturerId: number,
  ) {
    const lecturerLike = await this.lecturerLikeService.createLecturerLike(
      lecturerId,
      authorizedData.user.id,
    );

    return { lecturerLike };
  }

  @ApiOperation({ summary: '강사 좋아요 삭제' })
  @ApiBearerAuth()
  @UseGuards(UserAccessTokenGuard)
  @Delete(':lecturerId')
  async deleteLecturerLike(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Param('lecturerId', ParseIntPipe) lecturerId: number,
  ) {
    return await this.lecturerLikeService.deleteLecturerLike(
      lecturerId,
      authorizedData.user.id,
    );
  }

  @ApiReadManyLecturerLike()
  @UseGuards(UserAccessTokenGuard)
  @Get()
  async readManyLecturerLike(
    @GetAuthorizedUser() authorizedData: ValidateResult,
  ) {
    return await this.lecturerLikeService.readManyLecturerLike(
      authorizedData.user.id,
    );
  }
}
