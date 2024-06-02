import { ApiProperty } from '@nestjs/swagger';
import {
  IEsLecture,
  IEsLecturer,
  IEsPass,
} from '../../interface/search.interface';
import { EsLectureDto } from './es-lecture.dto';
import { EsLecturerDto } from './es-lecturer.dto';
import { EsPassDto } from './es-pass.dto ';
import { Type, plainToInstance } from 'class-transformer';

export class CombinedSearchResultDto {
  @ApiProperty({
    description: '검색된 강사 정보',
    type: [EsLecturerDto],
  })
  @Type(() => EsLecturerDto)
  searchedLecturers: EsLecturerDto[];

  @ApiProperty({
    description: '검색된 강사 정보',
    type: [EsLectureDto],
  })
  @Type(() => EsLectureDto)
  searchedLectures: EsLectureDto[];

  @ApiProperty({
    description: '검색된 패스권 정보',
    type: [EsPassDto],
  })
  @Type(() => EsPassDto)
  searchedPasses: EsPassDto[];
}
