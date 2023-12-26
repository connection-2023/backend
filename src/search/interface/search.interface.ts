export interface ESLecture {
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
  lecturer: EsSimpleLecturer;
  genres: EsGenre[];
  regions: EsRegion[];
  isLiked: boolean | undefined;
  searchAfter: number[];
}

export interface EsLecturer {
  id: number;
  stars: number;
  regions: EsRegion[];
  genres: EsGenre[];
  nickname: string;
  affiliation: string;
  profilecardimageurl: string;
  updatedat: Date;
  reviewcount: number;
  isLiked: boolean | undefined;
  lecturerImages: string[];
  searchAfter: number[];
}

export interface EsSimpleLecturer {
  lecturerId: number;
  nickname: string;
  profileCardImageUrl: string;
}

export interface EsGenre {
  categoryId: number;
  genre: string;
}

export interface EsRegion {
  regionId: number;
  administrativeDistrict: string;
  district: string;
}
