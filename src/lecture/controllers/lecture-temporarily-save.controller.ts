import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { LecturerAccessTokenGuard } from '@src/common/guards/lecturer-access-token.guard';
import { ValidateResult } from '@src/common/interface/common-interface';
import { LectureTemporarilySaveService } from '@src/lecture/services/lecture-temporarily-save.service';
import { UpsertTemporaryLectureDto } from '../dtos/update-temporary-lecture.dto';
import { ApiReadOneTemporaryLecture } from '../swagger-decorators/read-one-temporary-lecture-decorator';
import { ApiReadManyTemporaryLecture } from '../swagger-decorators/read-many-temporary-lecture=decorator';

@ApiTags('강의')
@Controller('lecture-temporarily-save')
export class LectureTemporarilySaveController {
  constructor(
    private readonly lectureTemporarilySaveService: LectureTemporarilySaveService,
  ) {}

  @ApiOperation({ summary: '임시저장 디폴트 데이터 생성' })
  @ApiBearerAuth()
  @Post()
  @UseGuards(LecturerAccessTokenGuard)
  async createTemporaryLecture(
    @GetAuthorizedUser() authorizedData: ValidateResult,
  ) {
    return await this.lectureTemporarilySaveService.createTemporaryLecture(
      authorizedData.lecturer.id,
    );
  }

  @ApiOperation({ summary: '임시저장' })
  @ApiBearerAuth()
  @Patch()
  @UseGuards(LecturerAccessTokenGuard)
  async upsertTemporaryLecture(
    @Body() upsertTemporaryLectureDto: UpsertTemporaryLectureDto,
  ) {
    return await this.lectureTemporarilySaveService.upsertTemporaryLecture(
      upsertTemporaryLectureDto,
    );
  }

  @ApiReadOneTemporaryLecture()
  @Get(':lectureId')
  @UseGuards(LecturerAccessTokenGuard)
  async readOneTemporaryLecture(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Param('lectureId') lectureId: number,
  ) {
    const temporaryLecture =
      await this.lectureTemporarilySaveService.readOneTemporaryLecture(
        authorizedData.lecturer.id,
        lectureId,
      );
    return { temporaryLecture };
  }

  @ApiReadManyTemporaryLecture()
  @Get()
  @UseGuards(LecturerAccessTokenGuard)
  async readManyTemporaryLecture(
    @GetAuthorizedUser() authorizedData: ValidateResult,
  ) {
    const temporaryLectures =
      await this.lectureTemporarilySaveService.readManyTemporaryLecture(
        authorizedData.lecturer.id,
      );

    return { temporaryLectures };
  }
}
