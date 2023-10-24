import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { LecturerAccessTokenGuard } from '@src/common/guards/lecturer-access-token.guard';
import { ValidateResult } from '@src/common/interface/common-interface';
import { LectureTemporarilySaveService } from '@src/lecture/services/lecture-temporarily-save.service';

@ApiTags('강의')
@Controller('lecture-temporarily-save')
export class LectureTemporarilySaveController {
  constructor(
    private readonly lectureTemporarilySaveService: LectureTemporarilySaveService,
  ) {}

  @ApiOperation({ summary: '임시저장 데이터 생성' })
  @ApiBearerAuth()
  @Post()
  @UseGuards(LecturerAccessTokenGuard)
  async createTemporaryLecture(
    @GetAuthorizedUser() authorizedData: ValidateResult,
  ) {
    return this.lectureTemporarilySaveService.createTemporaryLecture(
      authorizedData.lecturer.id,
    );
  }
}
