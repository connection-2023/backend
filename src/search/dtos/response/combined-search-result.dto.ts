import { ApiProperty } from '@nestjs/swagger';
import {
  IEsLecture,
  IEsLecturer,
  IEsPass,
} from '../../interface/search.interface';
import { EsLectureDto } from './es-lecture.dto';
import { EsLecturerDto } from './es-lecturer.dto';
import { EsPassDto } from './es-pass.dto ';

export class CombinedSearchResultDto {
  @ApiProperty({
    description: '검색된 강사 정보',
    type: [EsLecturerDto],
  })
  searchedLecturers: EsLecturerDto[];

  @ApiProperty({
    description: '검색된 강사 정보',
    type: [EsLectureDto],
  })
  searchedLectures: EsLectureDto[];

  @ApiProperty({
    description: '검색된 패스권 정보',
    type: [EsPassDto],
  })
  searchedPasses: EsPassDto[];

  constructor(combinedSearchResult: {
    searchedLecturers?: IEsLecturer[];
    searchedLectures?: IEsLecture[];
    searchedPasses?: IEsPass[];
  }) {
    this.searchedLecturers = combinedSearchResult.searchedLecturers
      ? combinedSearchResult.searchedLecturers.map(
          (searchedLecturer) => new EsLecturerDto(searchedLecturer),
        )
      : [];

    this.searchedLectures = combinedSearchResult.searchedLectures
      ? combinedSearchResult.searchedLectures.map(
          (searchedLecture) => new EsLectureDto(searchedLecture),
        )
      : [];

    this.searchedPasses = combinedSearchResult.searchedPasses
      ? combinedSearchResult.searchedPasses.map(
          (searchedPass) => new EsPassDto(searchedPass),
        )
      : [];

    Object.assign(this);
  }
}
