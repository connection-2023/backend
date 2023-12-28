import { DanceCategory } from '@src/common/enum/enum';
import { LecturerSortOptions } from '../enum/search.enum';

export interface IESLecture {
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

export interface ILecturerSearchParams {
  take: number;
  value?: string;
  searchAfter?: number[];
  regions?: string[];
  genres?: DanceCategory[];
  stars?: number;
  sortOption?: LecturerSortOptions;
}
