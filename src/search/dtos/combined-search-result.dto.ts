import { ApiProperty } from '@nestjs/swagger';
import { ESLecture, EsLecturer } from '../interface/search.interface';
import { EsLectureDto } from './es-lecture.dto';
import { EsLecturerDto } from './es-lecturer.dto';

export class CombinedSearchResultDto {
  @ApiProperty({
    description: '검색된 강사 정보',
    type: EsLecturerDto,
    isArray: true,
  })
  searchedLecturers: EsLecturerDto[];

  @ApiProperty({
    description: '검색된 강사 정보',
    type: EsLectureDto,
    isArray: true,
  })
  searchedLectures: EsLectureDto[];

  constructor(combinedSearchResult: {
    searchedLecturers?: EsLecturer[];
    searchedLectures?: ESLecture[];
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

    Object.assign(this);
  }
}
