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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LectureService } from '@src/lecture/services/lecture.service';
import { CreateLectureDto } from '@src/lecture/dtos/create-lecture.dto';
import { ApiCreateLecture } from '../swagger-decorators/create-lecture-decorator';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { LecturerAccessTokenGuard } from '@src/common/guards/lecturer-access-token.guard';
import { ValidateResult } from '@src/common/interface/common-interface';
import { ApiReadOneLecture } from '../swagger-decorators/read-one-lecture-decorator';
import { ReadManyLectureQueryDto } from '../dtos/read-many-lecture-query.dto';
import { UpdateLectureDto } from '../dtos/update-lecture.dto';
import { ApiReadManyLectureSchedule } from '../swagger-decorators/read-many-lecture-schedule-decorator';
import { UserAccessTokenGuard } from '@src/common/guards/user-access-token.guard';
import { ApiReadLectureReservationWithUser } from '../swagger-decorators/read-reservation-with-user-id-decorator';
import { ApiReadOneLectureByNonMember } from '../swagger-decorators/read-one-lecture-by-lecturer-non-member-decorator';
import { ApiReadManyLectureWithLecturer } from '../swagger-decorators/read-many-lecture-with-lecturers-decorator';
import { ApiReadManyEnrollLecture } from '../swagger-decorators/read-many-enroll-lecture-decorator';
import { ReadManyEnrollLectureQueryDto } from '../dtos/read-many-enroll-lecture-query.dto';
import { ApiReadManyLectureProgress } from '../swagger-decorators/read-many-lecture-progress-decorator';
import { ReadManyLectureProgressQueryDto } from '../dtos/read-many-lecture-progress-query.dto';
import { ApiUpdateLecture } from '../swagger-decorators/update-lecture-decorator';
import { ApiReadManyParticipantWithScheduleId } from '../swagger-decorators/read-many-participant-with-schedule';
import { ApiReadManyLectureByNonMemeber } from '../swagger-decorators/read-many-lecture-by-non-member-decorator';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';
import { ApiGetLectureLearnerList } from '../swagger-decorators/get-lecture-learner-list.decorator';
import { LectureLearnerDto } from '../dtos/lecture-learner.dto';
import { GetLectureLearnerListDto } from '../dtos/get-lecture-learner-list.dto';
import { ApiReadManyLectureSchedulesWithLecturerId } from '../swagger-decorators/read-many-lecture-schedules-with-lecturer-id-decorator';
import { ReadManyLectureScheduleQueryDto } from '../dtos/read-many-lecture-schedule-query.dto';
import { ApiReadManyDailySchedules } from '../swagger-decorators/read-many-daily-schedules.decorator';

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

  @ApiReadOneLecture()
  @UseGuards(UserAccessTokenGuard)
  @Get(':lectureId/users')
  async readLectureWithUserId(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Param('lectureId', ParseIntPipe) lectureId: number,
  ) {
    const lecture = await this.lectureService.readLectureWithUserId(
      authorizedData.user.id,
      lectureId,
    );

    return lecture;
  }

  @ApiReadOneLectureByNonMember()
  @Get(':lectureId/non-members')
  async readLecture(@Param('lectureId', ParseIntPipe) lectureId: number) {
    const lecture = await this.lectureService.readLecture(lectureId);

    return lecture;
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

  @ApiReadManyLectureWithLecturer()
  @UseGuards(LecturerAccessTokenGuard)
  @Get('lecturers')
  async readManyLectureWithLecturerId(
    @GetAuthorizedUser() authorizedData: ValidateResult,
  ) {
    const lecture = await this.lectureService.readManyLectureWithLecturerId(
      authorizedData.lecturer.id,
    );

    return { lecture };
  }

  @ApiReadManyLectureByNonMemeber()
  @Get('lecturers/:lecturerId/non-members')
  async readManyLectureByNonMember(
    @Param('lecturerId', ParseIntPipe) lecturerId: number,
  ) {
    const lecture = await this.lectureService.readManyLectureWithLecturerId(
      lecturerId,
    );

    return { lecture };
  }

  @ApiReadManyEnrollLecture()
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

  @ApiReadManyLectureProgress()
  @UseGuards(LecturerAccessTokenGuard)
  @Get('lecturers/in-progress')
  async readManyLectureProgress(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Query() query: ReadManyLectureProgressQueryDto,
  ) {
    const lectureProgress = await this.lectureService.readManyLectureProgress(
      authorizedData.lecturer.id,
      query,
    );

    return { lectureProgress };
  }

  @ApiOperation({ summary: '강의 전체 수강생 조회' })
  @Get(':lectureId/participants')
  async readManyParticipantWithLectureId(
    @Param('lectureId', ParseIntPipe) lectureId: number,
  ) {
    const participant =
      await this.lectureService.readManyParticipantWithLectureId(lectureId);

    return { participant };
  }

  @ApiReadManyParticipantWithScheduleId()
  @Get(':lectureId/schedules/:scheduleId/participants')
  async readManyParticipantWithScheduleId(
    @Param('lectureId', ParseIntPipe) lectureId: number,
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
  ) {
    const participant =
      await this.lectureService.readManyParticipantWithScheduleId(
        lectureId,
        scheduleId,
      );

    return { participant };
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
}
