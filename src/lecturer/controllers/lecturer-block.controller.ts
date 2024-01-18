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
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { ValidateResult } from '@src/common/interface/common-interface';
import { LecturerBlockService } from '../services/lecturer-block.service';
import { ApiCreateLecturerBlock } from '../swagger-decorators/create-lecturer-block-decorator';
import { ApiReadManyLecturerBlock } from '../swagger-decorators/get-lecturer-block-decorator';

@ApiTags('강사 차단')
@Controller('lecturer-block')
export class LecturerBlockController {
  constructor(private readonly lecturerBlockService: LecturerBlockService) {}

  @ApiCreateLecturerBlock()
  @UseGuards(UserAccessTokenGuard)
  @Post(':lecturerId')
  async createLecturerBlock(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Param('lecturerId', ParseIntPipe) lecturerId: number,
  ) {
    const lecturerBlock = await this.lecturerBlockService.createLecturerBlock(
      lecturerId,
      authorizedData.user.id,
    );

    return { lecturerBlock };
  }

  @ApiOperation({ summary: '강사 차단 삭제' })
  @ApiBearerAuth()
  @UseGuards(UserAccessTokenGuard)
  @Delete(':lecturerId')
  async deleteLecturerBlock(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Param('lecturerId', ParseIntPipe) lecturerId: number,
  ) {
    return await this.lecturerBlockService.deleteLecturerBlock(
      lecturerId,
      authorizedData.user.id,
    );
  }

  @ApiReadManyLecturerBlock()
  @UseGuards(UserAccessTokenGuard)
  @Get()
  async readManyLecturerBlock(
    @GetAuthorizedUser() authorizedData: ValidateResult,
  ) {
    return await this.lecturerBlockService.readManyLecturerBlock(
      authorizedData.user.id,
    );
  }
}
