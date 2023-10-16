interface LecturerInputData {
  userId: number;
  nickname: string;
  email: string;
  phoneNumber: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  homepageUrl?: string;
  affiliation?: string;
  introduction: string;
  experience: string;
}

interface LecturerRegionInputData {
  lecturerId: number;
  regionId: number;
}

interface LecturerWebsiteInputData {
  lecturerId: number;
  url: string;
}

interface LecturerDanceGenreInputData {
  lecturerId: number;
  danceCategoryId: number;
  name?: string;
}

interface LecturerProfileImageInputData {
  lecturerId: number;
  url: string;
}
interface LecturerCoupon {
  id: number;
  title: string;
  percentage: number;
  discountPrice: number;
  isStackable: boolean;
  maxDiscountPrice: number;
  startAt: Date;
  endAt: Date;
}

export {
  LecturerInputData,
  LecturerRegionInputData,
  LecturerWebsiteInputData,
  LecturerDanceGenreInputData,
  LecturerProfileImageInputData,
  LecturerCoupon,
};
