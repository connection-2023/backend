import { DanceCategory, DanceMethod, Week } from '@src/common/enum/enum';
import { LecturerSortOptions, TimeOfDay } from '../enum/search.enum';

export interface IEsLecture {
  id: number;
  price: number;
  enddate: Date;
  lectureImages: string[];
  startdate: Date;
  title: string;
  isgroup: boolean;
  lecturemethod: string;
  stars: number;
  updatedat: Date;
  reviewcount: number;
  difficultylevel: string;
  lecturer: IEsSimpleLecturer;
  genres: IEsGenre[];
  regions: IEsRegion[];
  isLiked: boolean | undefined;
  searchAfter: number[];
  days: IEsEsLectureDay[];
}

export interface IEsLecturer {
  id: number;
  stars: number;
  regions: IEsRegion[];
  genres: IEsGenre[];
  nickname: string;
  affiliation: string;
  profilecardimageurl: string;
  updatedat: Date;
  reviewcount: number;
  isLiked: boolean | undefined;
  lecturerImages: string[];
  searchAfter: number[];
}

export interface IEsSimpleLecturer {
  lecturerId: number;
  nickname: string;
  profileCardImageUrl: string;
}

export interface IEsGenre {
  categoryId: number;
  genre: string;
}

export interface IEsRegion {
  regionId?: number;
  administrativeDistrict: string;
  district: string;
}

export interface IEsEsLectureDay {
  day: string[];
  dateTime: string[];
}

export interface ILecturerSearchParams {
  take: number;
  value?: string;
  searchAfter?: number[];
  regions?: string[];
  genres?: DanceCategory[];
  stars?: number;
  sortOption?: LecturerSortOptions;
}

export interface ILectureSearchParams {
  take: number;
  days?: Week[];
  timeOfDay?: TimeOfDay[];
  value?: string;
  searchAfter?: number[];
  regions?: string[];
  genres?: DanceCategory[];
  stars?: number;
  sortOption?: LecturerSortOptions;
  ltePrice?: number;
  gtePrice?: number;
  lectureMethod?: DanceMethod;
  isGroup: Boolean;
}
