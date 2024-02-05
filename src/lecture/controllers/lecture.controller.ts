import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LectureService } from '@src/lecture/services/lecture.service';
import { CreateLectureDto } from '@src/lecture/dtos/create-lecture.dto';
import { ApiCreateLecture } from '../swagger-decorators/create-lecture-decorator';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { LecturerAccessTokenGuard } from '@src/common/guards/lecturer-access-token.guard';
import { ValidateResult } from '@src/common/interface/common-interface';
import { ReadManyLectureQueryDto } from '../dtos/read-many-lecture-query.dto';
import { UpdateLectureDto } from '../dtos/update-lecture.dto';
import { ApiReadManyLectureSchedule } from '../swagger-decorators/read-many-lecture-schedule-decorator';
import { UserAccessTokenGuard } from '@src/common/guards/user-access-token.guard';
import { ApiReadLectureReservationWithUser } from '../swagger-decorators/read-reservation-with-user-id-decorator';
import { ReadManyEnrollLectureQueryDto } from '../dtos/read-many-enroll-lecture-query.dto';
import { ApiUpdateLecture } from '../swagger-decorators/update-lecture-decorator';
import { ApiReadManyParticipantWithScheduleId } from '../swagger-decorators/read-many-participant-with-schedule';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';
import { ApiGetLectureLearnerList } from '../swagger-decorators/get-lecture-learner-list.decorator';
import { LectureLearnerDto } from '../dtos/lecture-learner.dto';
import { GetLectureLearnerListDto } from '../dtos/get-lecture-learner-list.dto';
import { ApiReadManyLectureSchedulesWithLecturerId } from '../swagger-decorators/read-many-lecture-schedules-with-lecturer-id-decorator';
import { ReadManyLectureScheduleQueryDto } from '../dtos/read-many-lecture-schedule-query.dto';
import { ApiReadManyDailySchedules } from '../swagger-decorators/read-many-daily-schedules.decorator';
import { AllowUserAndGuestGuard } from '@src/common/guards/allow-user-guest.guard';
import { ApiReadOneLectureDetail } from '../swagger-decorators/read-one-lectire-detail.decorator';
import { ApiReadOneLecturePreview } from '../swagger-decorators/read-one-lecture-preview.decorator';
import { ApiGetScheduleLearnerList } from '../swagger-decorators/get-schedule-learner-list.decorator';
import { LectureLearnerInfoDto } from '../dtos/lecture-learner-info.dto';
import { ApiGetEnrollLectureSchedules } from '../swagger-decorators/get-enroll-lecture-schedule.decorator';
import { EnrollScheduleDetailQueryDto } from '../dtos/get-enroll-schedule-detail-query.dto';
import { ApiGetEnrollScheduleDetail } from '../swagger-decorators/get-enroll-schedule-detail.decorator';

@ApiTags('강의')
@Controller('lectures')
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  @ApiCreateLecture()
  @UseGuards(LecturerAccessTokenGuard)
  @Post()
  async createLecture(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Body() lecture: CreateLectureDto,
  ) {
    return await this.lectureService.createLecture(
      lecture,
      authorizedData.lecturer.id,
    );
  }

  @ApiReadOneLecturePreview()
  @SetResponseKey('lecturePreview')
  @UseGuards(AllowUserAndGuestGuard)
  @Get(':lectureId/previews')
  async readLecturePreview(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Param('lectureId', ParseIntPipe) lectureId: number,
  ) {
    const userId = authorizedData?.user?.id;

    return await this.lectureService.readLecturePreview(lectureId, userId);
  }

  @ApiReadOneLectureDetail()
  @SetResponseKey('lectureDetail')
  @Get(':lectureId/details')
  async readLectureDetail(@Param('lectureId', ParseIntPipe) lectureId: number) {
    return await this.lectureService.readLectureDetail(lectureId);
  }

  @ApiOperation({ summary: '강의 모두 보기' })
  @Get()
  async readManyLecture(@Query() query: ReadManyLectureQueryDto) {
    const lectures = await this.lectureService.readManyLecture(query);

    return { lectures };
  }

  @ApiOperation({ summary: '강의 삭제' })
  @Delete(':lectureId')
  async deleteLecture(@Param('lectureId', ParseIntPipe) lectureId: number) {
    const deletedLecture = await this.lectureService.deleteLecture(lectureId);

    return { lecture: deletedLecture };
  }

  @ApiUpdateLecture()
  @Patch(':lectureId')
  async updateLecture(
    @Param('lectureId', ParseIntPipe) lectureId: number,
    @Body() updateLectureDto: UpdateLectureDto,
  ) {
    const updatedLecture = await this.lectureService.updateLecture(
      lectureId,
      updateLectureDto,
    );

    return { updatedLecture };
  }

  @ApiReadManyLectureSchedule()
  @Get(':lectureId/schedules')
  async readLectureSchedule(
    @Param('lectureId', ParseIntPipe) lectureId: number,
  ) {
    const schedules = await this.lectureService.readManyLectureSchedule(
      lectureId,
    );

    return schedules;
  }

  @ApiGetScheduleLearnerList()
  @SetResponseKey('scheduleLearnerList')
  @UseGuards(LecturerAccessTokenGuard)
  @Get('schedules/:scheduleId/learners')
  async readLectureScheduleLearnerList(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
  ): Promise<LectureLearnerInfoDto[]> {
    return await this.lectureService.getLectureScheduleLearnerList(
      authorizedData.lecturer.id,
      scheduleId,
    );
  }

  @ApiReadLectureReservationWithUser()
  @UseGuards(UserAccessTokenGuard)
  @Get(':lectureId/reservations')
  async readLectureReservation(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Param('lectureId', ParseIntPipe) lectureId: number,
  ) {
    await this.lectureService.readLectureReservationWithUser(
      authorizedData.user.id,
      lectureId,
    );
  }

  @ApiGetLectureLearnerList()
  @SetResponseKey('lectureLearnerList')
  @UseGuards(LecturerAccessTokenGuard)
  @Get(':lectureId/learners')
  async getLectureLearnerList(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Query() paginationOptions: GetLectureLearnerListDto,
    @Param('lectureId', ParseIntPipe) lectureId: number,
  ): Promise<LectureLearnerDto[]> {
    return await this.lectureService.getLectureLearnerList(
      authorizedData.lecturer.id,
      paginationOptions,
      lectureId,
    );
  }

  @ApiGetEnrollLectureSchedules()
  @UseGuards(UserAccessTokenGuard)
  @Get('users')
  async readManyEnrollLectureWithUserId(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Query() query: ReadManyEnrollLectureQueryDto,
  ) {
    return await this.lectureService.readManyEnrollLectureWithUserId(
      authorizedData.user.id,
      query,
    );
  }

  @ApiReadManyLectureSchedulesWithLecturerId()
  @UseGuards(LecturerAccessTokenGuard)
  @Get('schedules')
  async readManyLectureSchedules(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Query() query: ReadManyLectureScheduleQueryDto,
  ) {
    const schedules =
      await this.lectureService.readManyLectureSchedulesWithLecturerId(
        authorizedData.lecturer.id,
        query,
      );

    return { schedules };
  }

  @ApiReadManyDailySchedules()
  @UseGuards(LecturerAccessTokenGuard)
  @Get('daily-schedules/:date')
  async readManyLectureDailySchedules(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Param('date') date: Date,
  ) {
    const schedules =
      await this.lectureService.readManyDailySchedulesWithLecturerId(
        authorizedData.lecturer.id,
        date,
      );

    return { schedules };
  }

  @ApiGetEnrollScheduleDetail()
  @UseGuards(UserAccessTokenGuard)
  @Get('enroll-schedule-detail/:scheduleId')
  async getEnrollScheduleDetail(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
    @Query() query: EnrollScheduleDetailQueryDto,
  ) {
    return await this.lectureService.getDetailEnrollSchedule(
      scheduleId,
      authorizedData.user.id,
      query,
    );
  }
}
