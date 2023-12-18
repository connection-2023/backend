import {
  Controller,
  Delete,
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

@ApiTags('강사 차단')
@Controller('lecturer-block')
export class LecturerBlockController {
  constructor(private readonly lecturerBlockService: LecturerBlockService) {}

  @ApiBearerAuth()
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
}
