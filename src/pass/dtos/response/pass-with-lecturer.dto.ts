import { PartialType, PickType, ApiProperty } from '@nestjs/swagger';
import { Lecture } from '@prisma/client';
import { BasicLecturerDto } from '@src/common/dtos/basic-lecturer.dto';
import { LecturePassDto } from '@src/common/dtos/lecture-pass.dto';
import { LectureDto } from '@src/common/dtos/lecture.dto';
import { Exclude, Expose, Transform, Type } from 'class-transformer';

@Exclude()
class PassWithLecturerLectureDto {
  @ApiProperty({
    type: Number,
    description: '강의 Id',
  })
  @Expose()
  id: number;

  @ApiProperty({
    type: Number,
    description: '강의 제목',
  })
  @Expose()
  title: string;
}

@Exclude()
class PassWithLecturerPassTargetDto {
  @ApiProperty({
    type: PassWithLecturerLectureDto,
    description: '강의 정보',
  })
  @Type(() => PassWithLecturerLectureDto)
  @Expose()
  lecture: PassWithLecturerLectureDto;

  constructor(lecture: PassWithLecturerPassTargetDto) {
    Object.assign(this, lecture);
  }
}

@Exclude()
export class PassWithLecturerDto extends LecturePassDto {
  @ApiProperty({
    type: BasicLecturerDto,
    description: '강사 정보',
  })
  @Type(() => BasicLecturerDto)
  @Expose()
  lecturer: BasicLecturerDto;

  @ApiProperty({
    type: [PassWithLecturerPassTargetDto],
    description: '적용된 강의',
  })
  @Transform(({ value }) =>
    value.map((passTarget) => new PassWithLecturerPassTargetDto(passTarget)),
  )
  @Expose()
  lecturePassTarget: PassWithLecturerPassTargetDto[];

  constructor(passWithLecturer: Partial<PassWithLecturerDto>) {
    super(passWithLecturer);

    Object.assign(this, passWithLecturer);
  }
}
